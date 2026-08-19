'use client';

function getStrength(password: string) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
const barColors = ['bg-border', 'bg-rose-500', 'bg-amber-500', 'bg-accent-solid', 'bg-emerald-500'];
const textColors = ['text-ink-tertiary', 'text-rose-500', 'text-amber-500', 'text-accent-solid', 'text-emerald-500'];

export function PasswordStrength({ password }: { password: string }) {
  const score = getStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i < score ? barColors[score] : 'bg-border-soft'}`} />
        ))}
      </div>
      <p className={`mt-1.5 text-[12px] font-medium ${textColors[score]}`}>{labels[score]}</p>
    </div>
  );
}