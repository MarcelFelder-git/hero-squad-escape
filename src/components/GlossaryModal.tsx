import { useMemo, useState } from 'react';
import { VOCAB } from '../data/vocab';
import { Modal, SpeakButton } from './ui';

export function GlossaryModal({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('');
  const [group, setGroup] = useState<number | 'all'>('all');

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return VOCAB.map((g, gi) => ({
      ...g,
      gi,
      entries: g.entries.filter(
        (e) =>
          !needle ||
          e.en.toLowerCase().includes(needle) ||
          e.de.toLowerCase().includes(needle) ||
          (e.example ?? '').toLowerCase().includes(needle),
      ),
    })).filter((g) => g.entries.length && (group === 'all' || group === g.gi));
  }, [q, group]);

  return (
    <Modal title="📖 Hero Field Glossary" onClose={onClose} wide className="glossary">
      <div className="glossary-tools">
        <input
          className="input"
          placeholder="Suchen / search … (z. B. went, fleißig)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <div className="chip-row">
          <button className={`chip ${group === 'all' ? 'chip-on' : ''}`} onClick={() => setGroup('all')}>
            All
          </button>
          {VOCAB.map((g, i) => (
            <button key={g.title} className={`chip ${group === i ? 'chip-on' : ''}`} onClick={() => setGroup(i)}>
              {g.title.replace('Unit 2: ', '')}
            </button>
          ))}
        </div>
      </div>
      <div className="glossary-list">
        {groups.length === 0 && <p className="muted">Nichts gefunden. Versuch ein anderes Wort!</p>}
        {groups.map((g) => (
          <section key={g.title}>
            <h3>{g.title}</h3>
            <table>
              <tbody>
                {g.entries.map((e) => (
                  <tr key={e.en}>
                    <td className="g-en">
                      <SpeakButton text={e.en.replace(/\(.*?\)|sb\.|sth\.|pl /g, '').replace(/,.*$/, '')} small />
                      <b>{e.en}</b>
                    </td>
                    <td className="g-de">{e.de}</td>
                    <td className="g-ex">{e.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}
      </div>
    </Modal>
  );
}
