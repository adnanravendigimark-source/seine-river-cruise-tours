const schedule = [
  ["November – February", "10:15 AM – 10:00 PM"],
  ["March", "10:15 AM – 10:30 PM"],
  ["April – September", "10:00 AM – 11:00 PM"],
  ["October", "10:15 AM – 10:30 PM"],
];

export default function PracticalInfo() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-stone-900">Cruise Schedule (2026)</h3>
          <table className="mt-4 w-full text-sm">
            <tbody>
              {schedule.map(([range, time]) => (
                <tr key={range} className="border-b border-stone-900/5">
                  <td className="py-2 text-stone-900/70">{range}</td>
                  <td className="py-2 text-right font-medium text-stone-900">{time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-stone-900/50">Departures every 30–45 minutes; exact times vary by operator.</p>
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-stone-900">Boarding Points</h3>
          <p className="mt-4 text-sm text-stone-900/70">
            <strong className="text-stone-900">Port de la Bourdonnais</strong> — 75007, at the Eiffel
            Tower. RER C (Champ de Mars / Tour Eiffel) or Métro 6 (Bir-Hakeim).
          </p>
          <p className="mt-3 text-sm text-stone-900/70">
            <strong className="text-stone-900">Pont de l'Alma</strong> — near the Champs-Élysées,
            used by several evening departures.
          </p>
          <p className="mt-3 text-sm text-stone-900/70">
            <strong className="text-stone-900">Pont Neuf</strong> — Île de la Cité, closest to
            Notre-Dame and the Louvre.
          </p>
          <p className="mt-3 text-xs text-stone-900/50">
            Arrive 15–20 minutes early — your confirmation email lists the exact dock number.
          </p>
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-stone-900">Best Time for a Cruise</h3>
          <p className="mt-4 text-sm text-stone-900/70">
            The hour before sunset gets you daylight on the way out and illuminated bridges on the
            way back. Book weekday mornings for the shortest boarding lines — June through August is
            peak season.
          </p>
        </div>
      </div>
    </section>
  );
}
