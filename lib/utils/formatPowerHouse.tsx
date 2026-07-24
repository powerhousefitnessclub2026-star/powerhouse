import React from 'react';

/**
 * Formats any string containing "POWER HOUSE" or "Power House" such that
 * the letter 'P' in Power and 'H' in House are colored red (text-red-500),
 * while remaining letters stay white/default.
 */
export function formatPowerHouse(text: string): React.ReactNode {
  if (!text) return text;

  const parts = text.split(/(power\s+house|fitness\s+club)/gi);

  if (parts.length === 1) return text;

  return parts.map((part, index) => {
    if (/^(power\s+house)$/i.test(part)) {
      const p = part[0]; // 'P'
      const ower = part.slice(1, 5); // 'OWER' or 'ower'
      const space = part[5] || ' ';
      const h = part[6]; // 'H'
      const ouse = part.slice(7); // 'OUSE' or 'ouse'

      return (
        <React.Fragment key={index}>
          <span className="text-red-500 font-bold">{p}</span>
          {ower}
          {space}
          <span className="text-red-500 font-bold">{h}</span>
          {ouse}
        </React.Fragment>
      );
    }
    if (/^(fitness\s+club)$/i.test(part)) {
      return (
        <span className="text-white font-bold" key={index}>
          {part}
        </span>
      );
    }
    return part;
  });
}
