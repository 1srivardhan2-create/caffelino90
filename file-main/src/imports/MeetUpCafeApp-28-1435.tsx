import imgImageLogo from "figma:asset/6acfd9d6c8ee7fd0ee085b43918ec67ad605c2de.png";

function ImageLogo() {
  return (
    <div className="absolute h-[80px] left-[202.66px] top-0 w-[266.663px]" data-name="Image (Logo)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageLogo} />
    </div>
  );
}

function Heading() {
  return (
    <div className="absolute h-[48px] left-0 top-[128px] w-[672px]" data-name="Heading 1">
      <p className="absolute font-['Advent_Pro:Regular',_sans-serif] font-normal leading-[48px] left-[335.98px] text-[48px] text-center text-neutral-950 text-nowrap top-[-0.8px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Welcome to MeetUp Café
      </p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute content-stretch flex h-[28px] items-start left-0 top-[200px] w-[672px]" data-name="Paragraph">
      <p className="basis-0 font-['Archivo_Narrow:Regular',_sans-serif] font-normal grow leading-[28px] min-h-px min-w-px relative shrink-0 text-[20px] text-center text-neutral-700">{`Choose how you'd like to continue`}</p>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white h-[128px] relative rounded-[16px] shrink-0 w-[212px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[1.6px] border-neutral-200 border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[12px] h-[128px] items-center justify-center pb-[1.613px] pt-[1.6px] px-[1.6px] relative w-[212px]">
        <p className="font-['Arial:Regular',_sans-serif] h-[38px] leading-[48px] not-italic relative shrink-0 text-[48px] text-black w-[76px]">GO</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-white h-[128px] relative rounded-[16px] shrink-0 w-[212px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[1.6px] border-neutral-200 border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[12px] h-[128px] items-center justify-center pb-[1.613px] pt-[1.6px] px-[1.6px] relative w-[212px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[48px] not-italic relative shrink-0 text-[48px] text-black text-nowrap whitespace-pre">Partner</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex gap-[24px] h-[128px] items-center justify-center left-[112px] top-[276px] w-[448px]" data-name="Container">
      <Button />
      <Button1 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[20px] left-0 top-[452px] w-[672px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[336.3px] not-italic text-[14px] text-center text-neutral-500 text-nowrap top-[-1.2px] translate-x-[-50%] whitespace-pre">Connect with real people over real conversations</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[472px] relative shrink-0 w-[672px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[472px] relative w-[672px]">
        <ImageLogo />
        <Heading />
        <Paragraph />
        <Container />
        <Paragraph1 />
      </div>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="box-border content-stretch flex h-[733px] items-center justify-center relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-[1171px]" data-name="LandingPage" style={{ backgroundImage: "linear-gradient(147.955deg, rgb(139, 89, 67) 2%, rgb(217, 191, 157) 52.404%, rgb(139, 89, 67) 100%), linear-gradient(90deg, rgb(248, 250, 252) 0%, rgb(248, 250, 252) 100%)" }}>
      <Container1 />
    </div>
  );
}

export default function MeetUpCafeApp() {
  return (
    <div className="bg-[#fffbf5] content-stretch flex flex-col items-start relative size-full" data-name="MeetUp Café App">
      <LandingPage />
    </div>
  );
}