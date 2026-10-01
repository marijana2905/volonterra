import type { Editor } from "@tiptap/react"
import type { MinimalTiptapProps } from "./minimal-tiptap"

type ShortcutKeyResult = {
  symbol: string
  readable: string
}

export type FileError = {
  file: File | string
  reason: "type" | "size" | "invalidBase64" | "base64NotAllowed"
}

export type FileValidationOptions = {
  allowedMimeTypes: string[]
  maxFileSize?: number
  allowBase64: boolean
}

type FileInput = File | { src: string | File; alt?: string; title?: string }

export const isClient = (): boolean => typeof window !== "undefined"
export const isServer = (): boolean => !isClient()
export const isMacOS = (): boolean =>
  isClient() && window.navigator.platform === "MacIntel"

// Safe base64 utilities that work in both DOM and Node environments without type errors
const safeAtob = (data: string): string => {
  const atobImpl = (globalThis as any).atob as
    | ((data: string) => string)
    | undefined
  if (typeof atobImpl === "function") return atobImpl(data)
  const BufferCtor = (globalThis as any).Buffer
  if (BufferCtor?.from) return BufferCtor.from(data, "base64").toString("binary")
  throw new Error("Base64 decode not supported in this environment")
}

const safeBtoa = (data: string): string => {
  const btoaImpl = (globalThis as any).btoa as
    | ((data: string) => string)
    | undefined
  if (typeof btoaImpl === "function") return btoaImpl(data)
  const BufferCtor = (globalThis as any).Buffer
  if (BufferCtor?.from) return BufferCtor.from(data, "binary").toString("base64")
  throw new Error("Base64 encode not supported in this environment")
}

// Compute the byte length of a base64 string or data URL without relying on atob
const base64ByteLength = (input: string): number => {
  const parts = input.split(",")
  const base64 = parts.length > 1 ? parts.slice(1).join(",") : input
  const cleaned = base64.replace(/\s/g, "")
  const padding = cleaned.endsWith("==") ? 2 : cleaned.endsWith("=") ? 1 : 0
  return Math.floor((cleaned.length * 3) / 4) - padding
}

const shortcutKeyMap: Record<string, ShortcutKeyResult> = {
  mod: isMacOS()
    ? { symbol: "⌘", readable: "Command" }
    : { symbol: "Ctrl", readable: "Control" },
  alt: isMacOS()
    ? { symbol: "⌥", readable: "Option" }
    : { symbol: "Alt", readable: "Alt" },
  shift: { symbol: "⇧", readable: "Shift" },
}

export const getShortcutKey = (key: string): ShortcutKeyResult =>
  shortcutKeyMap[key.toLowerCase()] || { symbol: key, readable: key }

export const getShortcutKeys = (keys: string[]): ShortcutKeyResult[] =>
  keys.map(getShortcutKey)

export const getOutput = (
  editor: Editor,
  format: MinimalTiptapProps["output"]
): object | string => {
  switch (format) {
    case "json":
      return editor.getJSON()
    case "html":
      // Avoid potential type issues with editor.isEmpty by checking text content
      return editor.getText().trim().length === 0 ? "" : editor.getHTML()
    default:
      return editor.getText()
  }
}

export const isUrl = (
  text: string,
  options: { requireHostname: boolean; allowBase64?: boolean } = {
    requireHostname: false,
  }
): boolean => {
  if (text.includes("\n")) return false

  try {
    const url = new URL(text)
    const blockedProtocols = [
      "javascript:",
      "file:",
      "vbscript:",
      ...(options.allowBase64 ? [] : ["data:"]),
    ]

    if (blockedProtocols.includes(url.protocol)) return false
    if (options.allowBase64 && url.protocol === "data:")
      return /^data:image\/[a-z]+;base64,/.test(text)
    if (url.hostname) return true

    return (
      url.protocol !== "" &&
      (url.pathname.startsWith("//") || url.pathname.startsWith("http")) &&
      !options.requireHostname
    )
  } catch {
    return false
  }
}

export const sanitizeUrl = (
  url: string | null | undefined,
  options: { allowBase64?: boolean } = {}
): string | undefined => {
  if (!url) return undefined

  if (options.allowBase64 && url.startsWith("data:image")) {
    return isUrl(url, { requireHostname: false, allowBase64: true })
      ? url
      : undefined
  }

  return isUrl(url, {
    requireHostname: false,
    allowBase64: options.allowBase64,
  }) || /^(\/|#|mailto:|sms:|fax:|tel:)/.test(url)
    ? url
    : `https://${url}`
}

export const blobUrlToBase64 = async (blobUrl: string): Promise<string> => {
  const response = await fetch(blobUrl)
  const blob = await response.blob()

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result)
      } else {
        reject(new Error("Failed to convert Blob to base64"))
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export const randomId = (): string => Math.random().toString(36).slice(2, 11)

export const fileToBase64 = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result)
      } else {
        reject(new Error("Failed to convert File to base64"))
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const validateFileOrBase64 = <T extends FileInput>(
  input: File | string,
  options: FileValidationOptions,
  originalFile: T,
  validFiles: T[],
  errors: FileError[]
): void => {
  const { isValidType, isValidSize } = checkTypeAndSize(input, options)

  if (isValidType && isValidSize) {
    validFiles.push(originalFile)
  } else {
    if (!isValidType) errors.push({ file: input, reason: "type" })
    if (!isValidSize) errors.push({ file: input, reason: "size" })
  }
}

const checkTypeAndSize = (
  input: File | string,
  { allowedMimeTypes, maxFileSize }: FileValidationOptions
): { isValidType: boolean; isValidSize: boolean } => {
  const mimeType = input instanceof File ? input.type : base64MimeType(input)
  const size = input instanceof File ? input.size : base64ByteLength(input)

  const isValidType =
    allowedMimeTypes.length === 0 ||
    allowedMimeTypes.includes(mimeType) ||
    allowedMimeTypes.includes(`${mimeType.split("/")[0]}/*`)

  const isValidSize = !maxFileSize || size <= maxFileSize

  return { isValidType, isValidSize }
}

const base64MimeType = (encoded: string): string => {
  const result = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)
  return result?.[1] ?? "unknown"
}

const isBase64 = (str: string): boolean => {
  if (str.startsWith("data:")) {
    const matches = str.match(/^data:[^;]+;base64,(.+)$/)
    if (matches && matches[1]) {
      str = matches[1]
    } else {
      return false
    }
  }

  try {
    return safeBtoa(safeAtob(str)) === str
  } catch {
    return false
  }
}

export const filterFiles = <T extends FileInput>(
  files: T[],
  options: FileValidationOptions
): [T[], FileError[]] => {
  const validFiles: T[] = []
  const errors: FileError[] = []

  files.forEach((file) => {
    const actualFile = "src" in file ? file.src : file

    if (actualFile instanceof File) {
      validateFileOrBase64(actualFile, options, file, validFiles, errors)
    } else if (typeof actualFile === "string") {
      if (isBase64(actualFile)) {
        if (options.allowBase64) {
          validateFileOrBase64(actualFile, options, file, validFiles, errors)
        } else {
          errors.push({ file: actualFile, reason: "base64NotAllowed" })
        }
      } else {
        if (!sanitizeUrl(actualFile, { allowBase64: options.allowBase64 })) {
          errors.push({ file: actualFile, reason: "invalidBase64" })
        } else {
          validFiles.push(file)
        }
      }
    }
  })

  return [validFiles, errors]
}
