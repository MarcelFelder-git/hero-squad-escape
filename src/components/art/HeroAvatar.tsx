import type { Hero } from '../../game/types';
import { Person } from './Person';

export function HeroAvatar({ hero, bust, className }: { hero: Hero; bust?: boolean; className?: string }) {
  const l = hero.look;
  return (
    <Person
      className={className}
      title={hero.name}
      bust={bust}
      skin={l.skin}
      hair={l.hair}
      hairStyle={l.hairStyle}
      suit={l.suit}
      cape={l.cape}
      emblem={l.emblem}
      mask={l.mask}
      accessory={l.accessory}
    />
  );
}
