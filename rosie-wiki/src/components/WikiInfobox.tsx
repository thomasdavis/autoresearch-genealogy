interface InfoboxField {
  label: string;
  value: string;
}

interface WikiInfoboxProps {
  headerLabel: string;
  headerValue: string;
  image?: string;
  imageCaption?: string;
  fields: InfoboxField[];
}

export default function WikiInfobox({
  headerLabel,
  headerValue,
  fields,
}: WikiInfoboxProps) {
  return (
    <table className="float-right ml-6 mb-4 w-[320px] border border-[#a2a9b1] bg-[#f8f9fa] text-sm border-collapse">
      <tbody>
        <tr>
          <th
            colSpan={2}
            className="bg-[#cee0f2] text-center p-2 text-base font-bold border-b border-[#a2a9b1]"
          >
            {headerLabel}
          </th>
        </tr>
        <tr>
          <td
            colSpan={2}
            className="text-center p-2 text-xs italic text-[#555] border-b border-[#a2a9b1]"
          >
            {headerValue}
          </td>
        </tr>
        {fields.map((field, i) => (
          <tr key={i} className="border-b border-[#e0e0e0]">
            <th className="text-left p-2 pr-3 bg-[#e8ecf1] font-semibold align-top w-[110px] border-r border-[#e0e0e0]">
              {field.label}
            </th>
            <td className="p-2 align-top">{field.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
