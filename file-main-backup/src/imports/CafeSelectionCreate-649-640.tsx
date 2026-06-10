function Button() {
  return (
    <div className="bg-[#c9b5a0] h-[56px] relative rounded-[16px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Button">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-[488.31px] not-italic text-[#0a0a0a] text-[16px] text-center text-nowrap top-[16.2px] translate-x-[-50%]">Send for Voting →</p>
    </div>
  );
}

export default function CafeSelectionCreate() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start pb-0 pt-[16px] px-[91.6px] relative size-full" data-name="CafeSelectionCreate">
      <Button />
    </div>
  );
}