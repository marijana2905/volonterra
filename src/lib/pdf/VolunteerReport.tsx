import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

import { formatDateTime } from '../utils';

type VolunteerReportAction = {
  id: string;
  title: string;
  city: string;
  address: string;
  fullDateFrom: Date | string;
  fullDateTo: Date | string;
  description?: string | null;
};

type VolunteerReportProps = {
  actions: VolunteerReportAction[];
  logoSrc?: string | null;
  generatedAt?: Date | string;
  fullName?: string | null;
};

const POPPINS_REGULAR_URL =
  'https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Regular.ttf';
const POPPINS_BOLD_URL = 'https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Bold.ttf';

let fontsRegistered = false;

const registerFonts = () => {
  if (fontsRegistered) {
    return;
  }

  Font.register({
    family: 'Poppins',
    fonts: [
      { src: POPPINS_REGULAR_URL, fontWeight: 'normal' },
      { src: POPPINS_BOLD_URL, fontWeight: 'bold' },
    ],
  });

  fontsRegistered = true;
};

registerFonts();

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 32,
    paddingHorizontal: 32,
    fontSize: 10,
    fontFamily: 'Poppins',
    color: '#334155',
    backgroundColor: '#f8fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: '#2f9b6b',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 26,
    height: 26,
    objectFit: 'contain',
  },
  headerTextGroup: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 8,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f7a55',
    fontFamily: 'Poppins',
    lineHeight: 1.1,
  },
  reportSubtitle: {
    fontSize: 9,
    marginTop: 2,
    color: '#475569',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  metaLabel: {
    fontSize: 8,
    marginTop: 2,
    letterSpacing: 0.8,
    color: '#64748b',
  },
  metaValue: {
    fontSize: 10,
    marginTop: 2,
    color: '#0f172a',
  },
  summaryCard: {
    backgroundColor: '#eef7f0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1f7a55',
    fontFamily: 'Poppins',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 10,
    lineHeight: 1.4,
    color: '#334155',
  },
  highlight: {
    fontWeight: 'bold',
    color: '#1f7a55',
    fontFamily: 'Poppins',
  },
  actionsWrapper: {
    flexDirection: 'column',
  },
  actionCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d7e9df',
    backgroundColor: '#ffffff',
    padding: 12,
    marginBottom: 8,
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionIndex: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f7a55',
    fontFamily: 'Poppins',
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    fontFamily: 'Poppins',
  },
  actionInfo: {
    fontSize: 10,
    color: '#475569',
    marginTop: 2,
  },
  divider: {
    marginVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e6eef3',
  },
  description: {
    fontSize: 9,
    lineHeight: 1.3,
    color: '#64748b',
  },
  emptyState: {
    fontSize: 10,
    textAlign: 'center',
    color: '#64748b',
    marginTop: 20,
  },
  footer: {
    position: 'absolute',
    left: 32,
    right: 32,
    bottom: 24,
    fontSize: 9,
    color: '#64748b',
    textAlign: 'center',
  },
});

const normalizeDate = (value: Date | string): Date => {
  if (value instanceof Date) {
    return value;
  }

  return new Date(value);
};

const VolunteerReport = ({ actions, logoSrc, generatedAt, fullName }: VolunteerReportProps) => {
  const totalCities = new Set(actions.map(action => action.city)).size;
  const generatedDate = generatedAt ? normalizeDate(generatedAt) : new Date();
  const currentYear = generatedDate.getFullYear();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {logoSrc ? <Image src={logoSrc} style={styles.logo} /> : null}
            <View style={styles.headerTextGroup}>
              <Text style={styles.reportTitle}>VolonTerra · Izveštaj o angažovanju</Text>
              <Text style={styles.reportSubtitle}>
                Budi promena. Zajedno gradimo snažniju zajednicu.
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.metaLabel}>Datum generisanja</Text>
            <Text style={styles.metaValue}>{formatDateTime(generatedDate)}</Text>
            <Text style={styles.metaLabel}>Broj akcija</Text>
            <Text style={styles.metaValue}>{actions.length}</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{fullName}</Text>
          <Text style={styles.summaryText}>
            U periodu do {formatDateTime(generatedDate)} zabeleženo je{' '}
            <Text style={styles.highlight}>{actions.length}</Text> volonterskih angažovanja na
            kojima ste prisustvovali. Volonterski rad izvršen je u{' '}
            <Text style={styles.highlight}> {totalCities}</Text> različitih gradova.
          </Text>
        </View>

        {actions.length === 0 ? (
          <Text style={styles.emptyState}>Nema zabeleženih učešća sa statusom prisustvovao.</Text>
        ) : (
          <View style={styles.actionsWrapper}>
            {actions.map((action, index) => {
              const startDate = normalizeDate(action.fullDateFrom);
              const endDate = normalizeDate(action.fullDateTo);

              return (
                <View key={action.id} style={styles.actionCard} wrap={false}>
                  <View style={styles.actionHeader}>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                    <Text style={styles.actionIndex}>#{index + 1}</Text>
                  </View>
                  <Text style={styles.actionInfo}>
                    Lokacija: {action.city}, {action.address}
                  </Text>
                  <Text style={styles.actionInfo}>
                    Trajanje: {formatDateTime(startDate)} – {formatDateTime(endDate)}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        <Text
          style={styles.footer}
          fixed
          render={({ pageNumber, totalPages }) =>
            `VolonTerra · ${currentYear} · Strana ${pageNumber} od ${totalPages}`
          }
        />
      </Page>
    </Document>
  );
};

export default VolunteerReport;
