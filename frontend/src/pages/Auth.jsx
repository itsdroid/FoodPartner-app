import GlassCard from '../ui/GlassCard.jsx'

function Auth() {
  return (
    <div className="grid md:grid-cols-2 gap-6 items-start">
      <GlassCard className="p-6">
        <div className="text-lg font-medium">Sign In</div>
        <div className="mt-4 space-y-3 text-sm text-white/70">
          <div className="h-10 rounded-xl bg-white/10 border border-white/10" />
          <div className="h-10 rounded-xl bg-white/10 border border-white/10" />
          <div className="h-10 rounded-xl bg-white/10 border border-white/10" />
        </div>
      </GlassCard>
      <GlassCard className="p-6">
        <div className="text-lg font-medium">Sign Up</div>
        <div className="mt-4 space-y-3 text-sm text-white/70">
          <div className="h-10 rounded-xl bg-white/10 border border-white/10" />
          <div className="h-10 rounded-xl bg-white/10 border border-white/10" />
          <div className="h-10 rounded-xl bg-white/10 border border-white/10" />
        </div>
      </GlassCard>
    </div>
  )
}

export default Auth


