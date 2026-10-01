import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ColorLegend = () => {
  const legendItems = [
    { color: 'bg-amber-500/50', label: 'Predstojeća akcija' },
    { color: 'bg-emerald-500/50', label: 'Akcija u toku' },
    { color: 'bg-red-500/50', label: 'Otkazana akcija' },
    { color: 'bg-sky-500/50', label: 'Završena akcija' },
    { color: 'bg-violet-500/50', label: 'Potrebna potvrda' },
  ];

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight">Legenda boja</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {legendItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <span className={`h-5 w-5 rounded-full ${item.color}`} aria-label={item.label} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground mt-6 border-t pt-4 text-sm">
          Kliknite na bilo koji događaj u kalendaru za prikaz detaljnijih informacija.
        </p>
      </CardContent>
    </Card>
  );
};

export default ColorLegend;
