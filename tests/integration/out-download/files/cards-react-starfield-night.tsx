// Compact starfield: procedurally generated box-shadow stars
// on a radial-gradient night sky, drifting upward.
<div className="relative h-44 w-64 overflow-hidden rounded-2xl
  [background:radial-gradient(ellipse_at_bottom,#1b2735_0%,#090a0f_100%)]">
  <span className="absolute h-px w-px" style={{ boxShadow: STAR_S1, animation: "sf 60s linear infinite" }} />
  <span className="absolute h-[2px] w-[2px]" style={{ boxShadow: STAR_S2, animation: "sf 100s linear infinite" }} />
  <span className="absolute h-[3px] w-[3px]" style={{ boxShadow: STAR_S3, animation: "sf 150s linear infinite" }} />
  <h4 className="absolute inset-0 grid place-items-center bg-gradient-to-b from-white to-[#38495a] bg-clip-text text-transparent">STARS</h4>
  <style>{`@keyframes sf{to{transform:translateY(-600px)}}`}</style>
</div>