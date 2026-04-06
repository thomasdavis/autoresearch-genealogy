interface TocItem {
  id: string;
  title: string;
  subsections?: TocItem[];
}

interface WikiTableOfContentsProps {
  items: TocItem[];
}

export default function WikiTableOfContents({
  items,
}: WikiTableOfContentsProps) {
  return (
    <div className="inline-block bg-[#f8f9fa] border border-[#a2a9b1] p-4 my-4 min-w-[200px]">
      <div className="text-center font-bold mb-2">Contents</div>
      <ol className="list-decimal pl-6 text-sm">
        {items.map((item, i) => (
          <li key={item.id} className="my-0.5">
            <a href={`#${item.id}`} className="text-[#0645ad]">
              {item.title}
            </a>
            {item.subsections && item.subsections.length > 0 && (
              <ol className="list-decimal pl-5 mt-0.5">
                {item.subsections.map((sub) => (
                  <li key={sub.id} className="my-0.5">
                    <a href={`#${sub.id}`} className="text-[#0645ad]">
                      {sub.title}
                    </a>
                  </li>
                ))}
              </ol>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
