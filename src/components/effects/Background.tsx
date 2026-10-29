import { useCanvasEffects } from '../../hooks/useCanvasEffects';

// Fondo animado: nebulosa + canvas de estrellas + capa de partículas
export function Background() {
  const { bgRef, fxRef } = useCanvasEffects();

  return (
    <>
      <div className="nebula" aria-hidden="true" />
      <canvas ref={bgRef} id="bg" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <canvas ref={fxRef} id="fx" aria-hidden="true" />
    </>
  );
}
