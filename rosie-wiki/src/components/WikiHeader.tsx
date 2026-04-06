import Link from "next/link";

export default function WikiHeader() {
  return (
    <header className="border-b border-[#a2a9b1] bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div className="text-2xl font-serif font-bold text-[#202122]">
              Rosie<span className="text-[#72777d] font-normal">pedia</span>
            </div>
            <div className="text-xs text-[#72777d] border-l border-[#c8ccd1] pl-3">
              EKY Native Title Rosie Encyclopedia
            </div>
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link
              href="/"
              className="text-[#0645ad] hover:underline"
            >
              Main page
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
