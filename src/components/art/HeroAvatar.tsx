import type { Hero } from '../../game/types';
import { Person } from './Person';

const POWER_AURA: Record<Hero['power'], string> = {
  speedster: '#ffd60a',
  mindhacker: '#c77dff',
  timebender: '#4cc9f0',
  shield: '#2ecc71',
  gadget: '#ff9f1c',
};

/**
 * Draws a hero with the gear unlocked so far.
 * gear = number of completed levels (0 = normal kid … 8 = full superhero).
 */
export function HeroAvatar({ hero, gear = 8, bust, className }: { hero: Hero; gear?: number; bust?: boolean; className?: string }) {
  const l = hero.look;
  const suitOn = gear >= 2;
  return (
    <Person
      className={className}
      title={hero.name}
      bust={bust}
      skin={l.skin}
      hair={l.hair}
      hairStyle={l.hairStyle}
      suit={suitOn ? l.suit : l.shirt ?? '#6c757d'}
      legs={suitOn ? undefined : '#3d5a80'}
      emblem={suitOn ? l.emblem : undefined}
      mask={gear >= 1 ? l.mask : 'none'}
      gloves={gear >= 3 ? l.cape : undefined}
      boots={gear >= 4 ? l.cape : undefined}
      belt={gear >= 5}
      cape={gear >= 6 ? l.cape : undefined}
      aura={gear >= 7 ? POWER_AURA[hero.power] : undefined}
      flying={gear >= 8 && !bust}
      accessory={l.accessory}
    />
  );
}
