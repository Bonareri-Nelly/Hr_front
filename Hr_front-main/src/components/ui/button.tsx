interface ButtonProps {
  children: React.ReactNode;
}

export default function Button({ children }: ButtonProps) {
  return (
    <button className="px-4 py-2 rounded-md bg-[var(--navy-deepest)] text-white text-sm font-semibold">
      {children}
    </button>
  );
}