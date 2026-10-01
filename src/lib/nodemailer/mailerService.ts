import transporter from '.';

// Exact colors from globals.css in oklch format
// const theme = {
//   background: 'oklch(0.9711 0.0074 80.7211)',
//   foreground: 'oklch(0.3 0.0358 30.2042)',
//   primary: 'oklch(0.5234 0.1347 144.1672)',
//   primaryForeground: 'oklch(1 0 0)',
//   border: 'oklch(0.8805 0.0208 74.6428)',
//   muted: 'oklch(91.476% 0.01079 76.463)',
// };

// Classic format colors
const theme = {
  background: '#f8f5f0', // oklch(0.9711 0.0074 80.7211)
  foreground: '#000000', // oklch(0.3 0.0358 30.2042)
  primary: '#2e7d32', // oklch(0.5234 0.1347 144.1672)
  primaryForeground: '#ffffff', // oklch(1 0 0)
  border: '#e0d6c9', // oklch(0.8805 0.0208 74.6428)
  muted: '#e7e2db', // oklch(91.476% 0.01079 76.463)
};

interface VerificationEmailMeta {
  description: string;
  link: string; // Full absolute URL
  expiresMinutes?: number;
}

interface SendVerificationArgs {
  to: string;
  meta: VerificationEmailMeta;
}

// Small helper to build a very lightweight responsive email layout.
const buildLayout = (content: string, opts?: { title?: string }) => {
  const { title = 'VolonTerra' } = opts || {};
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="color-scheme" content="light" />
  </head>
  <body style="margin:0;padding:0;background:${theme.background};font-family:Poppins,Arial,Helvetica,sans-serif;color:${theme.foreground};-webkit-font-smoothing:antialiased;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${theme.background};padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:${theme.background};border:1px solid ${theme.border};border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:32px 32px 16px 32px;text-align:center;">
                <h1 style="margin:0;font-size:24px;line-height:1.25;font-weight:600;">${title}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px 32px;font-size:15px;line-height:1.5;">
                ${content}
              </td>
            </tr>
            <tr>
              <td style="background:${theme.muted};padding:16px 32px;text-align:center;font-size:12px;color:${theme.foreground};">
                <p style="margin:0;">&copy; ${new Date().getFullYear()} VolonTerra. Sva prava zadržana.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const sendVerificationLinkEmail = async ({ to, meta }: SendVerificationArgs) => {
  const { description, link, expiresMinutes } = meta;

  // Accessible styled button (tables preferred for broad client support)
  const buttonHTML = `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0;">
    <tr>
      <td style="border-radius:8px;background:${theme.primary};text-align:center;">
  <a href="${link}" style="display:inline-block;padding:14px 26px;font-size:15px;font-weight:600;text-decoration:none;color:${theme.primaryForeground};background:${theme.primary};border-radius:8px;">Potvrdi email</a>
      </td>
    </tr>
  </table>`;

  const extraInfo = expiresMinutes
    ? `<p style="margin:16px 0 0 0;font-size:12px;color:${theme.foreground};opacity:.8;">Ovaj link ističe za ${expiresMinutes} minut${expiresMinutes === 1 ? '' : 'a'}.</p>`
    : '';

  const htmlContent = `
    <p style="margin:0 0 16px 0;">${description}</p>
    <p style="margin:0 0 16px 0;">Kliknite na dugme ispod da potvrdite svoju email adresu i završite kreiranje naloga.</p>
    ${buttonHTML}
    <p style="margin:0 0 8px 0;font-size:13px;">Ako dugme ne radi, kopirajte ovaj URL i nalepite ga u pregledač:</p>
    <p style="margin:0;word-break:break-all;font-size:12px;"><a href="${link}" style="color:${theme.primary};text-decoration:underline;">${link}</a></p>
    ${extraInfo}
  `;

  const html = buildLayout(htmlContent, { title: 'Potvrdite svoj email' });
  const text = `VolonTerra - Verifikacija email adrese\n\n${description}\n\nOtvorite link ispod da potvrdite svoj email:\n${link}${expiresMinutes ? `\n\n(Ovaj link ističe za ${expiresMinutes} minut${expiresMinutes === 1 ? '' : 'a'})` : ''}\n\nAko niste vi pokrenuli ovaj zahtev, ignorišite ovu poruku.`;

  try {
    await transporter.sendMail({
      from: `"No Reply" <${process.env.MAIL_USER}>`,
      to,
      subject: 'VolonTerra - Verifikacija email adrese',
      html,
      text,
    });

    return { success: true };
  } catch (error) {
    console.error('[MAIL ERROR]', error);
    return { success: false };
  }
};

export const sendResetPasswordLinkEmail = async ({ to, meta }: SendVerificationArgs) => {
  const { description, link, expiresMinutes } = meta;

  const buttonHTML = `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0;">
    <tr>
      <td style="border-radius:8px;background:${theme.primary};text-align:center;">
        <a href="${link}" style="display:inline-block;padding:14px 26px;font-size:15px;font-weight:600;text-decoration:none;color:${theme.primaryForeground};background:${theme.primary};border-radius:8px;">Resetuj lozinku</a>
      </td>
    </tr>
  </table>`;

  const extraInfo = expiresMinutes
    ? `<p style="margin:16px 0 0 0;font-size:12px;color:${theme.foreground};opacity:.8;">Ovaj link ističe za ${expiresMinutes} minut${expiresMinutes === 1 ? '' : 'a'}.</p>`
    : '';

  const htmlContent = `
    <p style="margin:0 0 16px 0;">${description}</p>
    <p style="margin:0 0 16px 0;">Kliknite na dugme ispod da nastavite proces resetovanja lozinke.</p>
    ${buttonHTML}
    <p style="margin:0 0 8px 0;font-size:13px;">Ako dugme ne radi, kopirajte ovaj URL i nalepite ga u pregledač:</p>
    <p style="margin:0;word-break:break-all;font-size:12px;"><a href="${link}" style="color:${theme.primary};text-decoration:underline;">${link}</a></p>
    ${extraInfo}
    <p style="margin:24px 0 0 0;font-size:12px;opacity:.8;">Ako niste vi tražili reset lozinke, ignorišite ovaj email.</p>
  `;

  const html = buildLayout(htmlContent, { title: 'Reset lozinke' });
  const text = `VolonTerra - Reset lozinke

${description}

Otvorite link ispod da resetujete lozinku:
${link}${
    expiresMinutes
      ? `

(Ovaj link ističe za ${expiresMinutes} minut${expiresMinutes === 1 ? '' : 'a'})`
      : ''
  }

Ako niste vi tražili reset lozinke, ignorišite ovu poruku.`;

  try {
    await transporter.sendMail({
      from: `"No Reply" <${process.env.MAIL_USER}>`,
      to,
      subject: 'VolonTerra - Reset lozinke',
      html,
      text,
    });
    return { success: true };
  } catch (error) {
    console.error('[MAIL ERROR]', error);
    return { success: false };
  }
};

export const sendReplyToQuestionEmail = async (
  to: string,
  questionContent: string,
  organizerName: string,
  organizerEmail: string,
  answerContent: string,
) => {
  const appUrl = process.env.NEXT_PUBLIC_API_URL || process.env.APP_URL || '';
  const registerUrl = appUrl
    ? `${appUrl.endsWith('/') ? appUrl.slice(0, -1) : appUrl}/auth/register`
    : '/auth/register';

  const registerButtonHTML = `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:16px 0 0 0;">
    <tr>
      <td style="border-radius:8px;background:${theme.primary};text-align:center;">
        <a href="${registerUrl}" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:600;text-decoration:none;color:${theme.primaryForeground};background:${theme.primary};border-radius:8px;">Kreirajte nalog</a>
      </td>
    </tr>
  </table>`;

  const htmlContent = `
    <p style="margin:0 0 16px 0;">Organizacija <strong>${organizerName}</strong> Vam je odgovorila na postavljeno pitanje.</p>
    <div style="margin:0 0 16px 0;padding:16px;background:${theme.muted};border-radius:8px;">
      <p style="margin:0 0 8px 0;font-weight:600;color:${theme.foreground};">Vaše pitanje</p>
      <p style="margin:0;color:${theme.foreground};line-height:1.5;white-space:pre-wrap;">${questionContent}</p>
    </div>
    <div style="margin:0 0 16px 0;padding:16px;border:1px solid ${theme.border};border-radius:8px;">
      <p style="margin:0 0 8px 0;font-weight:600;color:${theme.foreground};">Odgovor organizacije</p>
      <p style="margin:0;color:${theme.foreground};line-height:1.5;white-space:pre-wrap;">${answerContent}</p>
    </div>
    <p style="margin:0 0 12px 0;color:${theme.foreground};line-height:1.5;">Za dodatne informacije možete kontaktirati organizaciju na <a href="mailto:${organizerEmail}" style="color:${theme.primary};text-decoration:underline;">${organizerEmail}</a> ili kreirajte nalog na našoj platformi kako biste nastavili razgovor.</p>
    ${registerButtonHTML}
    <p style="margin:16px 0 0 0;color:${theme.foreground};opacity:.8;font-size:12px;">Ako vam je potreban dodatni odgovor, slobodno se obratite organizaciji.</p>
  `;

  const textContent = `Organizacija ${organizerName} Vam je odgovorila na pitanje.

Vaše pitanje:
${questionContent}

Odgovor:
${answerContent}

Za dodatne informacije pišite na ${organizerEmail} ili kreirajte nalog na ${registerUrl}.

Ako Vam je potreban dodatni odgovor, kontaktirajte organizaciju.`;

  try {
    await transporter.sendMail({
      from: `"No Reply" <${process.env.MAIL_USER}>`,
      to,
      subject: 'VolonTerra - Odgovor na Vaše pitanje',
      html: buildLayout(htmlContent, { title: 'Novi odgovor na pitanje' }),
      text: textContent,
    });

    return { success: true };
  } catch (error) {
    console.error('[MAIL ERROR]', error);
    return { success: false };
  }
};

export const sendCancelActionNotificationEmail = async (
  to: string,
  actionTitle: string,
  cancelReason: string,
) => {
  const sanitizedReason = escapeHtml(cancelReason);
  const sanitizedTitle = escapeHtml(actionTitle);

  const htmlContent = `
    <p style="margin:0 0 16px 0;">Obaveštavamo Vas da je akcija <strong>${sanitizedTitle}</strong> otkazana od strane organizatora.</p>
    <div style="margin:0 0 16px 0;padding:16px;border:1px solid ${theme.border};border-radius:8px;">
      <p style="margin:0 0 8px 0;font-weight:600;color:${theme.foreground};">Razlog otkazivanja:</p>
      <p style="margin:0;color:${theme.foreground};line-height:1.5;white-space:pre-line;">${sanitizedReason}</p>
    </div>
    <p style="margin:0;color:${theme.foreground};line-height:1.5;">Hvala Vam na razumevanju i nadamo se da ćemo se uskoro videti na nekoj drugoj akciji.</p>
  `;

  const textContent = `Akcija "${actionTitle}" je otkazana.

Razlog otkazivanja:
${cancelReason}

Hvala Vam na razumevanju i nadamo se da ćemo se uskoro videti na nekoj drugoj akciji.`;

  try {
    await transporter.sendMail({
      from: `"No Reply" <${process.env.MAIL_USER}>`,
      to,
      subject: `VolonTerra - Akcija "${actionTitle}" je otkazana`,
      html: buildLayout(htmlContent, { title: 'Akcija je otkazana' }),
      text: textContent,
    });

    return { success: true };
  } catch (error) {
    console.error('[MAIL ERROR - cancelAction]', error);
    return { success: false };
  }
};

export const sendYouAreBannedEmail = async (
  to: string,
  banReason: string,
  banExpires: Date | null,
) => {
  const sanitizedReason = escapeHtml(banReason || 'Nije naveden');

  const expiresInfoHtml = banExpires
    ? `<p style="margin:8px 0 0 0;font-size:13px;color:${theme.foreground};opacity:.85;">Ban ističe: <strong>${new Date(
        banExpires,
      ).toLocaleString('sr-RS')}</strong></p>`
    : `<p style="margin:8px 0 0 0;font-size:13px;color:${theme.foreground};opacity:.85;">Ban je neodređenog trajanja (trajni ban).</p>`;

  const htmlContent = `
    <p style="margin:0 0 12px 0;">Vaš nalog je privremeno onemogućen od strane administratora platforme.</p>
    <div style="margin:0 0 12px 0;padding:16px;border:1px solid ${theme.border};border-radius:8px;">
      <p style="margin:0 0 8px 0;font-weight:600;color:${theme.foreground};">Razlog:</p>
      <p style="margin:0;color:${theme.foreground};white-space:pre-line;">${sanitizedReason}</p>
      ${expiresInfoHtml}
    </div>
    <p style="margin:0;color:${theme.foreground};opacity:.85;font-size:13px;">Ako smatrate da je došlo do greške, možete odgovoriti na ovaj email.</p>
  `;

  const textContent = `Vaš nalog je onemogućen.

Razlog:
${banReason || 'Nije naveden'}

${banExpires ? `Ban ističe: ${new Date(banExpires).toLocaleString('sr-RS')}` : 'Ban je trajan (neodređenog trajanja).'}

Ako smatrate da je došlo do greške, odgovorite na ovu poruku.`;

  try {
    await transporter.sendMail({
      from: `"No Reply" <${process.env.MAIL_USER}>`,
      to,
      subject: 'VolonTerra - Vaš nalog je onemogućen',
      html: buildLayout(htmlContent, { title: 'Nalog je onemogućen' }),
      text: textContent,
    });
    return { success: true };
  } catch (error) {
    console.error('[MAIL ERROR - banned]', error);
    return { success: false };
  }
};

export const sendYourAreUnbannedEmail = async (to: string) => {
  const appUrl = process.env.NEXT_PUBLIC_API_URL || process.env.APP_URL || '';
  const loginUrl = appUrl
    ? `${appUrl.endsWith('/') ? appUrl.slice(0, -1) : appUrl}/auth/login`
    : '/auth/login';

  const buttonHTML = `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:16px 0 0 0;">
    <tr>
      <td style="border-radius:8px;background:${theme.primary};text-align:center;">
        <a href="${loginUrl}" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:600;text-decoration:none;color:${theme.primaryForeground};background:${theme.primary};border-radius:8px;">Prijavite se</a>
      </td>
    </tr>
  </table>`;

  const htmlContent = `
    <p style="margin:0 0 12px 0;">Obaveštavamo Vas da je ograničenje pristupa Vašem nalogu ukinuto.</p>
    <p style="margin:0 0 12px 0;">Sada možete ponovo da koristite platformu bez ograničenja.</p>
    ${buttonHTML}
  `;

  const textContent = `Ograničenje pristupa je ukinuto.

Sada možete da se prijavite i nastavite sa korišćenjem platforme.
${loginUrl}`;

  try {
    await transporter.sendMail({
      from: `"No Reply" <${process.env.MAIL_USER}>`,
      to,
      subject: 'VolonTerra - Ograničenje pristupa je ukinuto',
      html: buildLayout(htmlContent, { title: 'Ban je ukinut' }),
      text: textContent,
    });
    return { success: true };
  } catch (error) {
    console.error('[MAIL ERROR - unbanned]', error);
    return { success: false };
  }
};

// (Optional) Generic helper for future emails so you can reuse layout & theme.
export const sendGenericEmail = async (args: {
  to: string;
  subject: string;
  htmlBody: string; // inner content only, without <html>
  textBody?: string;
  title?: string;
}) => {
  const { to, subject, htmlBody, textBody, title } = args;
  try {
    const info = await transporter.sendMail({
      from: `"No Reply" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html: buildLayout(htmlBody, { title }),
      text: textBody,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    return { success: false, error };
  }
};
