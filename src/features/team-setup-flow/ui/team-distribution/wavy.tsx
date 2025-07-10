export function Wavy() {
  return (
    <svg className="svg-wavy">
      <filter id="wavy">
        <feTurbulence x="0" y="0" baseFrequency="0.09" numOctaves="5" seed="2">
          <animate attributeName="baseFrequency" dur="30s" values="0.2;0.05;0.2" repeatCount="indefinite"></animate>
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" scale="5"></feDisplacementMap>
      </filter>
    </svg>
  )
}
