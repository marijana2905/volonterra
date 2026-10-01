'use server';

import { renderToStream } from '@react-pdf/renderer';
import { Buffer } from 'buffer';
import fs from 'fs/promises';
import path from 'path';
import React from 'react';
import prisma from '@/lib/prisma';
import { ParticipationStatus } from '@prisma/types';

import { requireSession } from '@/data/auth/requireSession';
import VolunteerReport from '@/lib/pdf/VolunteerReport';

type GenerateVolunteerReportSuccess = {
  fileBase64: string;
  fileName: string;
  mimeType: string;
};

type GenerateVolunteerReportResult = { error: string } | GenerateVolunteerReportSuccess;

export async function generateVolunteerReport(): Promise<GenerateVolunteerReportResult> {
  const session = await requireSession();

  try {
    const participations = await prisma.userActionParticipation.findMany({
      where: {
        userId: session.user.id,
        status: ParticipationStatus.ATTENDED,
      },
      include: { action: true },
      orderBy: {
        action: {
          fullDateFrom: 'asc',
        },
      },
    });

    const actions = participations.map((participation) => participation.action);

    const reportElement = React.createElement(VolunteerReport, {
      actions,
      logoSrc: await getLogoDataUri(),
      generatedAt: new Date(),
      fullName: session.user.name,
    });
    const pdfStream = await renderToStream(reportElement as React.ReactElement<any>);
    const pdfBuffer = await streamToBuffer(pdfStream);

    return {
      fileBase64: pdfBuffer.toString('base64'),
      fileName: `Izveštaj_o_volonterskim_akcijama_${session.user.username}.pdf`,
      mimeType: 'application/pdf',
    };
  } catch (error) {
    console.error('[generateVolunteerReport]', error);
    return { error: 'Došlo je do greške prilikom generisanja izveštaja.' };
  }
}

let cachedLogoDataUri: string | null = null;

async function getLogoDataUri(): Promise<string | null> {
  if (cachedLogoDataUri) {
    return cachedLogoDataUri;
  }

  try {
    const candidatePaths = [
      path.resolve(process.cwd(), 'public', 'logo_without_text.png'),
      path.resolve(process.cwd(), 'apps', 'next-app', 'public', 'logo_without_text.png'),
      path.resolve(process.cwd(), '..', 'next-app', 'public', 'logo_without_text.png'),
      path.resolve(process.cwd(), '..', 'apps', 'next-app', 'public', 'logo_without_text.png'),
    ];

    let logoBuffer: Buffer | null = null;

    for (const candidate of candidatePaths) {
      try {
        await fs.access(candidate);
        logoBuffer = await fs.readFile(candidate);
        break;
      } catch (error) {
        // continue checking next candidate
      }
    }

    if (!logoBuffer) {
      throw new Error('Logo file not found in expected locations.');
    }

    cachedLogoDataUri = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    return cachedLogoDataUri;
  } catch (error) {
    console.error('[generateVolunteerReport:getLogoDataUri]', error);
    return null;
  }
}

async function streamToBuffer(
  stream: NodeJS.ReadableStream | ReadableStream<Uint8Array>,
): Promise<Buffer> {
  if (typeof (stream as ReadableStream<Uint8Array>).getReader === 'function') {
    const reader = (stream as ReadableStream<Uint8Array>).getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      if (value) {
        chunks.push(value);
      }
    }

    return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
  }

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    (stream as NodeJS.ReadableStream)
      .on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)))
      .on('end', () => resolve(Buffer.concat(chunks)))
      .on('error', reject);
  });
}
