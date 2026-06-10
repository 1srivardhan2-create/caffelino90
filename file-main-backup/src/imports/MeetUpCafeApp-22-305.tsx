import svgPaths from "./svg-8f7fdb0x8m";
const imgLogo = "/logo.png";
const imgCoffee11 = "/coffee11.png";
const imgMusic1 = "/music1.png";
const imgFood11 = "/food11.png";
const imgBook11 = "/book11.png";
const imgGame11 = "/game11.png";
const imgImageFridayCoffeeChat = "/fridayCoffeeChat.png";
const imgImageWeekendGamingNight = "/weekendGamingNight.png";
const imgImageStudyTechTalk = "/studyTechTalk.png";
function TextInput() {
  return (
    <div className="absolute bg-slate-100 box-border content-stretch flex h-[36px] items-center left-0 overflow-clip pl-[40px] pr-[16px] py-[8px] rounded-[2.68435e+07px] top-0 w-[448px]" data-name="Text Input">
      <p className="font-['Arial:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(10,10,10,0.5)] text-nowrap whitespace-pre">Search city, cafe or topic</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M14 14L11.1067 11.1067" id="Vector" stroke="var(--stroke-0, #90A1B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p107a080} id="Vector_2" stroke="var(--stroke-0, #90A1B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute h-[36px] left-[474.23px] top-[9.6px] w-[448px]" data-name="Container">
      <TextInput />
      <Icon />
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[#030213] box-border content-stretch flex gap-[6px] h-[32px] items-center justify-center left-[48px] px-[12px] py-0 rounded-[8px] top-[2px] w-[59.475px]" data-name="Button">
      <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Login</p>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[8px] size-[20px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p31962400} id="Vector" stroke="var(--stroke-0, #45556C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1f3d9f80} id="Vector_2" stroke="var(--stroke-0, #45556C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return <div className="absolute bg-[#fb2c36] left-[24px] rounded-[2.68435e+07px] size-[8px] top-[4px]" data-name="Text" />;
}

function Text1() {
  return (
    <div className="absolute bg-[#fb2c36] content-stretch flex items-center justify-center left-[20px] rounded-[2.68435e+07px] size-[20px] top-[-4px]" data-name="Text">
      <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">3</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute left-0 rounded-[2.68435e+07px] size-[36px] top-0" data-name="Button">
      <Icon1 />
      <Text />
      <Text1 />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute h-[36px] left-[1027.71px] top-[9.6px] w-[107.475px]" data-name="Container">
      <Button />
      <Button1 />
    </div>
  );
}

function App() {
  return (
    <div className="bg-white h-[55.2px] relative shrink-0 w-full" data-name="App">
      <div aria-hidden="true" className="absolute border-[0px_0px_0.8px] border-black border-solid inset-0 pointer-events-none shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <Container />
      <Container1 />
      <div className="absolute h-[55px] left-[3px] top-0 w-[184px]" data-name="Logo">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgLogo} />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Advent_Pro:Regular',_sans-serif] font-normal leading-[48px] left-[448.4px] text-[48px] text-center text-neutral-950 text-nowrap top-[-0.2px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Where Real People Meet Real Moments
      </p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Archivo_Narrow:Regular',_sans-serif] font-normal leading-[28px] left-[435.9px] text-[20px] text-center text-neutral-950 top-[-7.2px] translate-x-[-50%] w-[287px]">Find Your Tribe, One Cup at a Time.</p>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-white h-[40px] relative rounded-[8px] shrink-0 w-[132.55px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[40px] items-center justify-center px-[24px] py-0 relative w-[132.55px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">Create Group</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="h-[40px] relative rounded-[8px] shrink-0 w-[156.175px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[0.8px] border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[40px] items-center justify-center px-[24.8px] py-[0.8px] relative w-[156.175px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">Explore Meetups</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex gap-[16px] h-[40px] items-start justify-center left-1/2 top-[108px] translate-x-[-50%] w-[896px]" data-name="Container">
      <Button2 />
      <Button3 />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[164px] items-start left-[128px] top-[79.8px] w-[896px]" data-name="Container">
      <Heading />
      <Paragraph />
      <Container2 />
    </div>
  );
}

function Section() {
  return (
    <div className="absolute box-border content-stretch flex flex-col h-[324px] items-start left-0 pb-0 pt-[80px] px-[127.6px] top-0 w-[1151.2px]" data-name="Section">
      <Container3 />
    </div>
  );
}

function Badge() {
  return (
    <div className="absolute bg-[#eceef2] h-[21.587px] left-0 rounded-[8px] top-0 w-[58.913px]" data-name="Badge">
      <div className="box-border content-stretch flex gap-[4px] h-[21.587px] items-center justify-center overflow-clip px-[8.8px] py-[2.8px] relative rounded-[inherit] w-[58.913px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-nowrap whitespace-pre">Tonight</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Badge1() {
  return (
    <div className="absolute bg-[#eceef2] h-[21.587px] left-[66.91px] rounded-[8px] top-0 w-[68.338px]" data-name="Badge">
      <div className="box-border content-stretch flex gap-[4px] h-[21.587px] items-center justify-center overflow-clip px-[8.8px] py-[2.8px] relative rounded-[inherit] w-[68.338px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-nowrap whitespace-pre">Weekend</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Badge2() {
  return (
    <div className="absolute bg-[#eceef2] h-[21.587px] left-[143.25px] rounded-[8px] top-0 w-[54.413px]" data-name="Badge">
      <div className="box-border content-stretch flex gap-[4px] h-[21.587px] items-center justify-center overflow-clip px-[8.8px] py-[2.8px] relative rounded-[inherit] w-[54.413px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-nowrap whitespace-pre">Games</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Badge3() {
  return (
    <div className="absolute bg-[#eceef2] h-[21.587px] left-[205.66px] rounded-[8px] top-0 w-[48.462px]" data-name="Badge">
      <div className="box-border content-stretch flex gap-[4px] h-[21.587px] items-center justify-center overflow-clip px-[8.8px] py-[2.8px] relative rounded-[inherit] w-[48.462px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-nowrap whitespace-pre">Study</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Badge4() {
  return (
    <div className="absolute bg-[#eceef2] h-[21.587px] left-[262.13px] rounded-[8px] top-0 w-[84.638px]" data-name="Badge">
      <div className="box-border content-stretch flex gap-[4px] h-[21.587px] items-center justify-center overflow-clip px-[8.8px] py-[2.8px] relative rounded-[inherit] w-[84.638px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-nowrap whitespace-pre">Female-only</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[29.587px] overflow-clip relative shrink-0 w-full" data-name="Container">
      <Badge />
      <Badge1 />
      <Badge2 />
      <Badge3 />
      <Badge4 />
    </div>
  );
}

function Section1() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col h-[77.588px] items-start left-[16px] pb-0 pt-[24px] px-[24px] rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] top-[300px] w-[1119.2px]" data-name="Section">
      <Container4 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex h-[31.988px] items-start relative shrink-0 w-full" data-name="Heading 2">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[32px] min-h-px min-w-px not-italic relative shrink-0 text-[24px] text-neutral-950">Browse by Category</p>
    </div>
  );
}

function HomePage() {
  return (
    <div className="absolute h-[20px] left-[13px] top-[95px] w-[123.6px]" data-name="HomePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[123.6px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[62.21px] not-italic text-[14px] text-center text-neutral-950 text-nowrap top-[-1.2px] translate-x-[-50%] whitespace-pre">Coffee Meetups</p>
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[32px] h-[141.6px] items-start left-0 pb-[0.8px] pl-[24.8px] pr-[0.8px] pt-[24.8px] rounded-[14px] top-0" data-name="Card" style={{ backgroundImage: "linear-gradient(139.692deg, rgba(139, 89, 67, 0.7) 13.833%, rgba(217, 191, 157, 0.7) 50.997%, rgba(139, 89, 67, 0.7) 89.709%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%), linear-gradient(90deg, rgba(139, 89, 67, 0) 0%, rgba(139, 89, 67, 0) 100%)" }}>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <HomePage />
      <div className="absolute left-[calc(50%+0.2px)] size-[136px] top-[-2px] translate-x-[-50%]" data-name="coffee1 1">
        <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid box-border inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgCoffee11} />
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[136px]" />
      </div>
    </div>
  );
}

function HomePage1() {
  return (
    <div className="absolute h-[20px] left-[13px] top-[95px] w-[123.6px]" data-name="HomePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[123.6px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[62.21px] not-italic text-[14px] text-center text-neutral-950 text-nowrap top-[-1.2px] translate-x-[-50%] whitespace-pre">Coffee Meetups</p>
      </div>
    </div>
  );
}

function Card1() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[32px] h-[141.6px] items-start left-[199.2px] pb-[0.8px] pl-[24.8px] pr-[0.8px] pt-[24.8px] rounded-[14px] top-0" data-name="Card" style={{ backgroundImage: "linear-gradient(136.13deg, rgba(139, 89, 67, 0.7) 13.833%, rgba(217, 191, 157, 0.7) 50.997%, rgba(139, 89, 67, 0.7) 89.709%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%), linear-gradient(90deg, rgba(139, 89, 67, 0) 0%, rgba(139, 89, 67, 0) 100%)" }}>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <HomePage1 />
      <div className="absolute left-[19.8px] size-[103px] top-[6px]" data-name="music1">
        <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid box-border inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgMusic1} />
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[103px]" />
      </div>
    </div>
  );
}

function HomePage2() {
  return (
    <div className="absolute h-[20px] left-[13px] top-[95px] w-[123.6px]" data-name="HomePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[123.6px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[62.21px] not-italic text-[14px] text-center text-neutral-950 text-nowrap top-[-1.2px] translate-x-[-50%] whitespace-pre">Coffee Meetups</p>
      </div>
    </div>
  );
}

function Card2() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[32px] h-[141.6px] items-start left-[597.6px] pb-[0.8px] pl-[24.8px] pr-[0.8px] pt-[24.8px] rounded-[14px] top-0" data-name="Card" style={{ backgroundImage: "linear-gradient(135.107deg, rgba(139, 89, 67, 0.7) 13.833%, rgba(217, 191, 157, 0.7) 50.997%, rgba(139, 89, 67, 0.7) 89.709%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%), linear-gradient(90deg, rgba(139, 89, 67, 0) 0%, rgba(139, 89, 67, 0) 100%)" }}>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <HomePage2 />
      <div className="absolute h-[89px] left-[16.4px] top-[16px] w-[103px]" data-name="food1 1">
        <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid box-border inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgFood11} />
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[89px] w-[103px]" />
      </div>
    </div>
  );
}

function HomePage3() {
  return (
    <div className="absolute h-[20px] left-[13px] top-[95px] w-[123.6px]" data-name="HomePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[123.6px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[62.21px] not-italic text-[14px] text-center text-neutral-950 text-nowrap top-[-1.2px] translate-x-[-50%] whitespace-pre">Coffee Meetups</p>
      </div>
    </div>
  );
}

function Card3() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[32px] h-[141.6px] items-start left-[398.4px] pb-[0.8px] pl-[24.8px] pr-[0.8px] pt-[24.8px] rounded-[14px] top-0" data-name="Card" style={{ backgroundImage: "linear-gradient(134.898deg, rgba(139, 89, 67, 0.7) 13.833%, rgba(217, 191, 157, 0.7) 50.997%, rgba(139, 89, 67, 0.7) 89.709%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%), linear-gradient(90deg, rgba(139, 89, 67, 0) 0%, rgba(139, 89, 67, 0) 100%)" }}>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <HomePage3 />
      <div className="absolute left-[-0.4px] size-[136px] top-0" data-name="book1 1">
        <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid box-border inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgBook11} />
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[136px]" />
      </div>
    </div>
  );
}

function HomePage4() {
  return (
    <div className="absolute h-[20px] left-[13px] top-[95px] w-[123.6px]" data-name="HomePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[123.6px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[62.21px] not-italic text-[14px] text-center text-neutral-950 text-nowrap top-[-1.2px] translate-x-[-50%] whitespace-pre">Coffee Meetups</p>
      </div>
    </div>
  );
}

function Card4() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[32px] h-[142px] items-start left-[797px] pb-[0.8px] pl-[24.8px] pr-[0.8px] pt-[24.8px] rounded-[14px] top-0 w-[149px]" data-name="Card" style={{ backgroundImage: "linear-gradient(137.304deg, rgba(139, 89, 67, 0.7) 13.833%, rgba(217, 191, 157, 0.7) 50.997%, rgba(139, 89, 67, 0.7) 89.709%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%), linear-gradient(90deg, rgba(139, 89, 67, 0) 0%, rgba(139, 89, 67, 0) 100%)" }}>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <HomePage4 />
      <div className="absolute left-[26.2px] size-[112px] top-[15px]" data-name="game1 1">
        <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid box-border inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgGame11} />
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[112px]" />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute h-[141px] left-[103px] top-[112px] w-[946px]" data-name="Container">
      <Card />
      <Card1 />
      <Card2 />
      <Card3 />
      <Card4 />
    </div>
  );
}

function Section2() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[24px] h-[293.587px] items-start left-0 pb-0 pt-[48px] px-[16px] top-[377.8px] w-[1151.2px]" data-name="Section">
      <Heading1 />
      <Container5 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[31.988px] relative shrink-0 w-[195.675px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[31.988px] items-start relative w-[195.675px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[32px] not-italic relative shrink-0 text-[24px] text-neutral-950 text-nowrap whitespace-pre">Meetups Near You</p>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[75.24px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="h-[36px] relative rounded-[8px] shrink-0 w-[103.238px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[36px] relative w-[103.238px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[12px] not-italic text-[14px] text-neutral-950 text-nowrap top-[6.8px] whitespace-pre">View All</p>
        <Icon2 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex h-[36px] items-center justify-between relative w-full">
          <Heading4 />
          <Button4 />
        </div>
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="absolute h-[24px] left-[16px] top-[16px] w-[323.462px]" data-name="Heading 3">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-0 not-italic text-[16px] text-neutral-950 text-nowrap top-[-2.2px] whitespace-pre">{`Friday Coffee & Chat`}</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[48px] w-[323.462px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-0 not-italic text-[#45556c] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">Friendly meetup to chill and network</p>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p14548f00} id="Vector" stroke="var(--stroke-0, #45556C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17781bc0} id="Vector_2" stroke="var(--stroke-0, #45556C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[154.5px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[154.5px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-0 not-italic text-[#45556c] text-[14px] top-[-1.2px] w-[155px]">Café Milano • Hitech City</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[20px] items-center left-[16px] top-[80px] w-[323.462px]" data-name="Container">
      <Icon3 />
      <Text2 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M5.33333 1.33333V4" id="Vector" stroke="var(--stroke-0, #45556C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 1.33333V4" id="Vector_2" stroke="var(--stroke-0, #45556C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3ee34580} id="Vector_3" stroke="var(--stroke-0, #45556C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 6.66667H14" id="Vector_4" stroke="var(--stroke-0, #45556C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[119.287px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[119.287px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-0 not-italic text-[#45556c] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">Tomorrow, 6:00 PM</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[20px] items-center left-[16px] top-[112px] w-[323.462px]" data-name="Container">
      <Icon4 />
      <Text3 />
    </div>
  );
}

function Badge5() {
  return (
    <div className="bg-[#eceef2] h-[21.587px] relative rounded-[8px] shrink-0 w-[53.05px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[21.587px] items-center justify-center overflow-clip px-[8.8px] py-[2.8px] relative rounded-[inherit] w-[53.05px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-nowrap whitespace-pre">Coffee</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Badge6() {
  return (
    <div className="bg-[#eceef2] h-[21.587px] relative rounded-[8px] shrink-0 w-[81.825px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[21.587px] items-center justify-center overflow-clip px-[8.8px] py-[2.8px] relative rounded-[inherit] w-[81.825px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-nowrap whitespace-pre">Networking</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[21.587px] items-start left-[16px] top-[144px] w-[323.462px]" data-name="Container">
      <Badge5 />
      <Badge6 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p32887f80} id="Vector" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p35b3faa0} id="Vector_2" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p188b8380} id="Vector_3" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3694d280} id="Vector_4" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-full">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-0 not-italic text-[#45556c] text-[14px] top-[-1.2px] w-[63px]">3/6 joined</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[20px] relative shrink-0 w-[86.875px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[20px] items-center relative w-[86.875px]">
        <Icon5 />
        <Text4 />
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#030213] h-[32px] relative rounded-[8px] shrink-0 w-[49.737px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[6px] h-[32px] items-center justify-center px-[12px] py-0 relative w-[49.737px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Join</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-center justify-between left-[16px] top-[181.59px] w-[323.462px]" data-name="Container">
      <Container10 />
      <Button5 />
    </div>
  );
}

function HomePage5() {
  return (
    <div className="absolute h-[229.588px] left-[0.8px] top-[291.39px] w-[355.462px]" data-name="HomePage">
      <Heading2 />
      <Paragraph1 />
      <Container7 />
      <Container8 />
      <Container9 />
      <Container11 />
    </div>
  );
}

function ImageFridayCoffeeChat() {
  return (
    <div className="absolute h-[266.587px] left-0 top-0 w-[355.462px]" data-name="Image (Friday Coffee & Chat)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageFridayCoffeeChat} />
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.9)] h-[28px] left-[278.48px] rounded-[2.68435e+07px] top-[12px] w-[64.987px]" data-name="Container">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[12px] not-italic text-[14px] text-neutral-950 text-nowrap top-[2.8px] whitespace-pre">1.2 km</p>
    </div>
  );
}

function HomePage6() {
  return (
    <div className="absolute h-[266.587px] left-[0.8px] top-[0.8px] w-[355.462px]" data-name="HomePage">
      <ImageFridayCoffeeChat />
      <Container12 />
    </div>
  );
}

function Card5() {
  return (
    <div className="absolute bg-white h-[521.788px] left-0 rounded-[14px] top-0 w-[357.062px]" data-name="Card">
      <div className="h-[521.788px] overflow-clip relative rounded-[inherit] w-[357.062px]">
        <HomePage5 />
        <HomePage6 />
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Heading5() {
  return (
    <div className="absolute h-[24px] left-[16px] top-[16px] w-[323.462px]" data-name="Heading 3">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-0 not-italic text-[16px] text-neutral-950 text-nowrap top-[-2.2px] whitespace-pre">Weekend Gaming Night</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[48px] w-[323.462px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-0 not-italic text-[#45556c] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">Board games and fun conversations</p>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p14548f00} id="Vector" stroke="var(--stroke-0, #45556C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17781bc0} id="Vector_2" stroke="var(--stroke-0, #45556C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[20px] relative shrink-0 w-[156.262px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[156.262px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-0 not-italic text-[#45556c] text-[14px] top-[-1.2px] w-[157px]">Game Café • Banjara Hills</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[20px] items-center left-[16px] top-[80px] w-[323.462px]" data-name="Container">
      <Icon6 />
      <Text5 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M5.33333 1.33333V4" id="Vector" stroke="var(--stroke-0, #45556C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 1.33333V4" id="Vector_2" stroke="var(--stroke-0, #45556C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3ee34580} id="Vector_3" stroke="var(--stroke-0, #45556C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 6.66667H14" id="Vector_4" stroke="var(--stroke-0, #45556C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[20px] relative shrink-0 w-[111.037px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[111.037px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-0 not-italic text-[#45556c] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">Saturday, 8:00 PM</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[20px] items-center left-[16px] top-[112px] w-[323.462px]" data-name="Container">
      <Icon7 />
      <Text6 />
    </div>
  );
}

function Badge7() {
  return (
    <div className="bg-[#eceef2] h-[21.587px] relative rounded-[8px] shrink-0 w-[60.237px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[21.587px] items-center justify-center overflow-clip px-[8.8px] py-[2.8px] relative rounded-[inherit] w-[60.237px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-nowrap whitespace-pre">Gaming</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Badge8() {
  return (
    <div className="bg-[#eceef2] h-[21.587px] relative rounded-[8px] shrink-0 w-[37.638px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[21.587px] items-center justify-center overflow-clip px-[8.8px] py-[2.8px] relative rounded-[inherit] w-[37.638px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-nowrap whitespace-pre">Fun</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[21.587px] items-start left-[16px] top-[144px] w-[323.462px]" data-name="Container">
      <Badge7 />
      <Badge8 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p32887f80} id="Vector" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p35b3faa0} id="Vector_2" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p188b8380} id="Vector_3" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3694d280} id="Vector_4" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text7() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-full">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-0 not-italic text-[#45556c] text-[14px] top-[-1.2px] w-[63px]">5/8 joined</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[20px] relative shrink-0 w-[86.875px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[20px] items-center relative w-[86.875px]">
        <Icon8 />
        <Text7 />
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[#030213] h-[32px] relative rounded-[8px] shrink-0 w-[49.737px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[6px] h-[32px] items-center justify-center px-[12px] py-0 relative w-[49.737px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Join</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-center justify-between left-[16px] top-[181.59px] w-[323.462px]" data-name="Container">
      <Container16 />
      <Button6 />
    </div>
  );
}

function HomePage7() {
  return (
    <div className="absolute h-[229.588px] left-[0.8px] top-[291.39px] w-[355.462px]" data-name="HomePage">
      <Heading5 />
      <Paragraph2 />
      <Container13 />
      <Container14 />
      <Container15 />
      <Container17 />
    </div>
  );
}

function ImageWeekendGamingNight() {
  return (
    <div className="absolute h-[266.587px] left-0 top-0 w-[355.462px]" data-name="Image (Weekend Gaming Night)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageWeekendGamingNight} />
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.9)] h-[28px] left-[278.48px] rounded-[2.68435e+07px] top-[12px] w-[64.987px]" data-name="Container">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[12px] not-italic text-[14px] text-neutral-950 text-nowrap top-[2.8px] whitespace-pre">2.5 km</p>
    </div>
  );
}

function HomePage8() {
  return (
    <div className="absolute h-[266.587px] left-[0.8px] top-[0.8px] w-[355.462px]" data-name="HomePage">
      <ImageWeekendGamingNight />
      <Container18 />
    </div>
  );
}

function Card6() {
  return (
    <div className="absolute bg-white h-[521.788px] left-[381.06px] rounded-[14px] top-0 w-[357.062px]" data-name="Card">
      <div className="h-[521.788px] overflow-clip relative rounded-[inherit] w-[357.062px]">
        <HomePage7 />
        <HomePage8 />
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Heading6() {
  return (
    <div className="absolute h-[24px] left-[16px] top-[16px] w-[323.475px]" data-name="Heading 3">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-0 not-italic text-[16px] text-neutral-950 text-nowrap top-[-2.2px] whitespace-pre">{`Study & Tech Talk`}</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[48px] w-[323.475px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-0 not-italic text-[#45556c] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">Productive coding session</p>
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p14548f00} id="Vector" stroke="var(--stroke-0, #45556C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17781bc0} id="Vector_2" stroke="var(--stroke-0, #45556C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[20px] relative shrink-0 w-[172.812px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[172.812px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-0 not-italic text-[#45556c] text-[14px] top-[-1.2px] w-[173px]">{`Code & Coffee • Gachibowli`}</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[20px] items-center left-[16px] top-[80px] w-[323.475px]" data-name="Container">
      <Icon9 />
      <Text8 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M5.33333 1.33333V4" id="Vector" stroke="var(--stroke-0, #45556C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 1.33333V4" id="Vector_2" stroke="var(--stroke-0, #45556C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3ee34580} id="Vector_3" stroke="var(--stroke-0, #45556C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 6.66667H14" id="Vector_4" stroke="var(--stroke-0, #45556C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[20px] relative shrink-0 w-[93.112px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[93.112px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-0 not-italic text-[#45556c] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">Today, 4:00 PM</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[20px] items-center left-[16px] top-[112px] w-[323.475px]" data-name="Container">
      <Icon10 />
      <Text9 />
    </div>
  );
}

function Badge9() {
  return (
    <div className="bg-[#eceef2] h-[21.587px] relative rounded-[8px] shrink-0 w-[48.462px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[21.587px] items-center justify-center overflow-clip px-[8.8px] py-[2.8px] relative rounded-[inherit] w-[48.462px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-nowrap whitespace-pre">Study</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Badge10() {
  return (
    <div className="bg-[#eceef2] h-[21.587px] relative rounded-[8px] shrink-0 w-[42.063px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[21.587px] items-center justify-center overflow-clip px-[8.8px] py-[2.8px] relative rounded-[inherit] w-[42.063px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-nowrap whitespace-pre">Tech</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[21.587px] items-start left-[16px] top-[144px] w-[323.475px]" data-name="Container">
      <Badge9 />
      <Badge10 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p32887f80} id="Vector" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p35b3faa0} id="Vector_2" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p188b8380} id="Vector_3" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3694d280} id="Vector_4" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text10() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-full">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-0 not-italic text-[#45556c] text-[14px] top-[-1.2px] w-[63px]">2/6 joined</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[20px] relative shrink-0 w-[86.875px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[20px] items-center relative w-[86.875px]">
        <Icon11 />
        <Text10 />
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-[#030213] h-[32px] relative rounded-[8px] shrink-0 w-[49.737px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[6px] h-[32px] items-center justify-center px-[12px] py-0 relative w-[49.737px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Join</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-center justify-between left-[16px] top-[181.59px] w-[323.475px]" data-name="Container">
      <Container22 />
      <Button7 />
    </div>
  );
}

function HomePage9() {
  return (
    <div className="absolute h-[229.588px] left-[0.8px] top-[291.4px] w-[355.475px]" data-name="HomePage">
      <Heading6 />
      <Paragraph3 />
      <Container19 />
      <Container20 />
      <Container21 />
      <Container23 />
    </div>
  );
}

function ImageStudyTechTalk() {
  return (
    <div className="absolute h-[266.6px] left-0 top-0 w-[355.475px]" data-name="Image (Study & Tech Talk)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageStudyTechTalk} />
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.9)] h-[28px] left-[278.49px] rounded-[2.68435e+07px] top-[12px] w-[64.987px]" data-name="Container">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[12px] not-italic text-[14px] text-neutral-950 text-nowrap top-[2.8px] whitespace-pre">0.8 km</p>
    </div>
  );
}

function HomePage10() {
  return (
    <div className="absolute h-[266.6px] left-[0.8px] top-[0.8px] w-[355.475px]" data-name="HomePage">
      <ImageStudyTechTalk />
      <Container24 />
    </div>
  );
}

function Card7() {
  return (
    <div className="absolute bg-white h-[521.788px] left-[762.13px] rounded-[14px] top-0 w-[357.075px]" data-name="Card">
      <div className="h-[521.788px] overflow-clip relative rounded-[inherit] w-[357.075px]">
        <HomePage9 />
        <HomePage10 />
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[521.788px] relative shrink-0 w-full" data-name="Container">
      <Card5 />
      <Card6 />
      <Card7 />
    </div>
  );
}

function Section3() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[24px] h-[645.788px] items-start left-0 pb-0 pt-[32px] px-[16px] top-[671.17px] w-[1151.2px]" data-name="Section">
      <Container6 />
      <Container25 />
    </div>
  );
}

function Heading7() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[36px] left-[559.77px] not-italic text-[30px] text-center text-neutral-950 text-nowrap top-[-2.6px] translate-x-[-50%] whitespace-pre">How It Works</p>
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute bg-indigo-100 content-stretch flex items-center justify-center left-[95.9px] rounded-[2.68435e+07px] size-[64px] top-0" data-name="Container">
      <p className="font-['Arial:Regular',_'Noto_Sans:Regular',_sans-serif] leading-[32px] relative shrink-0 text-[24px] text-center text-neutral-950 text-nowrap whitespace-pre" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        1️⃣
      </p>
    </div>
  );
}

function Heading8() {
  return (
    <div className="absolute h-[24px] left-0 top-[80px] w-[255.8px]" data-name="Heading 3">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-[128.57px] not-italic text-[16px] text-center text-neutral-950 text-nowrap top-[-2.2px] translate-x-[-50%] whitespace-pre">Sign Up</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="absolute h-[20px] left-0 top-[112px] w-[255.8px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[128.25px] not-italic text-[#45556c] text-[14px] text-center text-nowrap top-[-1.2px] translate-x-[-50%] whitespace-pre">Create your profile in seconds</p>
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute h-[132px] left-0 top-0 w-[255.8px]" data-name="Container">
      <Container26 />
      <Heading8 />
      <Paragraph4 />
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute bg-indigo-100 content-stretch flex items-center justify-center left-[95.9px] rounded-[2.68435e+07px] size-[64px] top-0" data-name="Container">
      <p className="font-['Arial:Regular',_'Noto_Sans:Regular',_sans-serif] leading-[32px] relative shrink-0 text-[24px] text-center text-neutral-950 text-nowrap whitespace-pre" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        2️⃣
      </p>
    </div>
  );
}

function Heading9() {
  return (
    <div className="absolute h-[24px] left-0 top-[80px] w-[255.8px]" data-name="Heading 3">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-[128.01px] not-italic text-[16px] text-center text-neutral-950 text-nowrap top-[-2.2px] translate-x-[-50%] whitespace-pre">Join Group</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="absolute h-[20px] left-0 top-[112px] w-[255.8px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[127.41px] not-italic text-[#45556c] text-[14px] text-center text-nowrap top-[-1.2px] translate-x-[-50%] whitespace-pre">Find people with similar interests</p>
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute h-[132px] left-[287.8px] top-0 w-[255.8px]" data-name="Container">
      <Container28 />
      <Heading9 />
      <Paragraph5 />
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute bg-indigo-100 content-stretch flex items-center justify-center left-[95.9px] rounded-[2.68435e+07px] size-[64px] top-0" data-name="Container">
      <p className="font-['Arial:Regular',_'Noto_Sans:Regular',_sans-serif] leading-[32px] relative shrink-0 text-[24px] text-center text-neutral-950 text-nowrap whitespace-pre" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        3️⃣
      </p>
    </div>
  );
}

function Heading10() {
  return (
    <div className="absolute h-[24px] left-0 top-[80px] w-[255.8px]" data-name="Heading 3">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-[127.91px] not-italic text-[16px] text-center text-neutral-950 text-nowrap top-[-2.2px] translate-x-[-50%] whitespace-pre">{`Vote & Pay`}</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="absolute h-[20px] left-0 top-[112px] w-[255.8px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[128.07px] not-italic text-[#45556c] text-[14px] text-center text-nowrap top-[-1.2px] translate-x-[-50%] whitespace-pre">Decide time and split the bill</p>
    </div>
  );
}

function Container31() {
  return (
    <div className="absolute h-[132px] left-[575.6px] top-0 w-[255.8px]" data-name="Container">
      <Container30 />
      <Heading10 />
      <Paragraph6 />
    </div>
  );
}

function Container32() {
  return (
    <div className="absolute bg-indigo-100 content-stretch flex items-center justify-center left-[95.9px] rounded-[2.68435e+07px] size-[64px] top-0" data-name="Container">
      <p className="font-['Arial:Regular',_'Noto_Sans:Regular',_sans-serif] leading-[32px] relative shrink-0 text-[24px] text-center text-neutral-950 text-nowrap whitespace-pre" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        4️⃣
      </p>
    </div>
  );
}

function Heading11() {
  return (
    <div className="absolute h-[24px] left-0 top-[80px] w-[255.8px]" data-name="Heading 3">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-[128.13px] not-italic text-[16px] text-center text-neutral-950 text-nowrap top-[-2.2px] translate-x-[-50%] whitespace-pre">Meetup!</p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="absolute h-[20px] left-0 top-[112px] w-[255.8px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[127.55px] not-italic text-[#45556c] text-[14px] text-center text-nowrap top-[-1.2px] translate-x-[-50%] whitespace-pre">Enjoy your social dining experience</p>
    </div>
  );
}

function Container33() {
  return (
    <div className="absolute h-[132px] left-[863.4px] top-0 w-[255.8px]" data-name="Container">
      <Container32 />
      <Heading11 />
      <Paragraph7 />
    </div>
  );
}

function Container34() {
  return (
    <div className="h-[132px] relative shrink-0 w-full" data-name="Container">
      <Container27 />
      <Container29 />
      <Container31 />
      <Container33 />
    </div>
  );
}

function Section4() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col gap-[48px] h-[344px] items-start left-0 pb-0 pt-[64px] px-[16px] top-[1316.96px] w-[1151.2px]" data-name="Section">
      <Heading7 />
      <Container34 />
    </div>
  );
}

function Heading12() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[36px] left-[559.67px] not-italic text-[30px] text-center text-neutral-950 text-nowrap top-[-2.6px] translate-x-[-50%] whitespace-pre">{`Safe & Verified`}</p>
    </div>
  );
}

function Container35() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[40px] left-[128.18px] not-italic text-[36px] text-center text-neutral-950 text-nowrap top-[-3px] translate-x-[-50%] whitespace-pre">✅</p>
    </div>
  );
}

function Heading13() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-[127.75px] not-italic text-[16px] text-center text-neutral-950 text-nowrap top-[-2.2px] translate-x-[-50%] whitespace-pre">Verified Users</p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[128.71px] not-italic text-[#45556c] text-[14px] text-center text-nowrap top-[-1.2px] translate-x-[-50%] whitespace-pre">{`Phone & ID verification`}</p>
    </div>
  );
}

function Container36() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[104px] items-start left-0 top-0 w-[255.8px]" data-name="Container">
      <Container35 />
      <Heading13 />
      <Paragraph8 />
    </div>
  );
}

function Container37() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[40px] left-[128.18px] not-italic text-[36px] text-center text-neutral-950 text-nowrap top-[-3px] translate-x-[-50%] whitespace-pre">🛡️</p>
    </div>
  );
}

function Heading14() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-[128.31px] not-italic text-[16px] text-center text-neutral-950 text-nowrap top-[-2.2px] translate-x-[-50%] whitespace-pre">Safe Meetups</p>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[128.8px] not-italic text-[#45556c] text-[14px] text-center text-nowrap top-[-1.2px] translate-x-[-50%] whitespace-pre">Only public cafés</p>
    </div>
  );
}

function Container38() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[104px] items-start left-[287.8px] top-0 w-[255.8px]" data-name="Container">
      <Container37 />
      <Heading14 />
      <Paragraph9 />
    </div>
  );
}

function Container39() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[40px] left-[128.18px] not-italic text-[36px] text-center text-neutral-950 text-nowrap top-[-3px] translate-x-[-50%] whitespace-pre">📍</p>
    </div>
  );
}

function Heading15() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-[128.09px] not-italic text-[16px] text-center text-neutral-950 text-nowrap top-[-2.2px] translate-x-[-50%] whitespace-pre">Real People</p>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[127.94px] not-italic text-[#45556c] text-[14px] text-center text-nowrap top-[-1.2px] translate-x-[-50%] whitespace-pre">No fake accounts</p>
    </div>
  );
}

function Container40() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[104px] items-start left-[575.6px] top-0 w-[255.8px]" data-name="Container">
      <Container39 />
      <Heading15 />
      <Paragraph10 />
    </div>
  );
}

function Container41() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[40px] left-[128.18px] not-italic text-[36px] text-center text-neutral-950 text-nowrap top-[-3px] translate-x-[-50%] whitespace-pre">🚨</p>
    </div>
  );
}

function Heading16() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-[128.03px] not-italic text-[16px] text-center text-neutral-950 text-nowrap top-[-2.2px] translate-x-[-50%] whitespace-pre">Report System</p>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[128.74px] not-italic text-[#45556c] text-[14px] text-center text-nowrap top-[-1.2px] translate-x-[-50%] whitespace-pre">{`Block & report anytime`}</p>
    </div>
  );
}

function Container42() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[104px] items-start left-[863.4px] top-0 w-[255.8px]" data-name="Container">
      <Container41 />
      <Heading16 />
      <Paragraph11 />
    </div>
  );
}

function Container43() {
  return (
    <div className="h-[104px] relative shrink-0 w-full" data-name="Container">
      <Container36 />
      <Container38 />
      <Container40 />
      <Container42 />
    </div>
  );
}

function Section5() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[48px] h-[316px] items-start left-0 pb-0 pt-[64px] px-[16px] top-[1660.96px] w-[1151.2px]" data-name="Section">
      <Heading12 />
      <Container43 />
    </div>
  );
}

function Heading17() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-[-2.2px] whitespace-pre">MeetUp Café</p>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-0 not-italic text-[#90a1b9] text-[14px] top-[-1.2px] w-[212px]">Connect with real people over real conversations.</p>
    </div>
  );
}

function Container44() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[116px] items-start left-0 top-0 w-[255.8px]" data-name="Container">
      <Heading17 />
      <Paragraph12 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-[-2.2px] whitespace-pre">Quick Links</p>
    </div>
  );
}

function Link() {
  return (
    <div className="absolute content-stretch flex h-[18.4px] items-start left-0 top-[0.8px] w-[37.525px]" data-name="Link">
      <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#90a1b9] text-[14px] text-nowrap whitespace-pre">Home</p>
    </div>
  );
}

function ListItem() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="List Item">
      <Link />
    </div>
  );
}

function Link1() {
  return (
    <div className="absolute content-stretch flex h-[18.4px] items-start left-0 top-[0.8px] w-[52.712px]" data-name="Link">
      <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#90a1b9] text-[14px] text-nowrap whitespace-pre">Discover</p>
    </div>
  );
}

function ListItem1() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="List Item">
      <Link1 />
    </div>
  );
}

function Link2() {
  return (
    <div className="absolute content-stretch flex h-[18.4px] items-start left-0 top-[0.8px] w-[67.275px]" data-name="Link">
      <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#90a1b9] text-[14px] text-nowrap whitespace-pre">Contact Us</p>
    </div>
  );
}

function ListItem2() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="List Item">
      <Link2 />
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[76px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem />
      <ListItem1 />
      <ListItem2 />
    </div>
  );
}

function Container45() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[116px] items-start left-[287.8px] top-0 w-[255.8px]" data-name="Container">
      <Heading3 />
      <List />
    </div>
  );
}

function Heading18() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-[-2.2px] whitespace-pre">Legal</p>
    </div>
  );
}

function Link3() {
  return (
    <div className="absolute content-stretch flex h-[18.4px] items-start left-0 top-[0.8px] w-[99.925px]" data-name="Link">
      <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#90a1b9] text-[14px] text-nowrap whitespace-pre">Terms of Service</p>
    </div>
  );
}

function ListItem3() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="List Item">
      <Link3 />
    </div>
  );
}

function Link4() {
  return (
    <div className="absolute content-stretch flex h-[18.4px] items-start left-0 top-[0.8px] w-[82.563px]" data-name="Link">
      <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#90a1b9] text-[14px] text-nowrap whitespace-pre">Privacy Policy</p>
    </div>
  );
}

function ListItem4() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="List Item">
      <Link4 />
    </div>
  );
}

function Link5() {
  return (
    <div className="absolute content-stretch flex h-[18.4px] items-start left-0 top-[0.8px] w-[28.887px]" data-name="Link">
      <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#90a1b9] text-[14px] text-nowrap whitespace-pre">Help</p>
    </div>
  );
}

function ListItem5() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="List Item">
      <Link5 />
    </div>
  );
}

function List1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[76px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem3 />
      <ListItem4 />
      <ListItem5 />
    </div>
  );
}

function Container46() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[116px] items-start left-[575.6px] top-0 w-[255.8px]" data-name="Container">
      <Heading18 />
      <List1 />
    </div>
  );
}

function Heading19() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-[-2.2px] whitespace-pre">Contact</p>
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-0 not-italic text-[#90a1b9] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">support@meetupcafe.com</p>
    </div>
  );
}

function Container47() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[116px] items-start left-[863.4px] top-0 w-[255.8px]" data-name="Container">
      <Heading19 />
      <Paragraph13 />
    </div>
  );
}

function Container48() {
  return (
    <div className="h-[116px] relative shrink-0 w-full" data-name="Container">
      <Container44 />
      <Container45 />
      <Container46 />
      <Container47 />
    </div>
  );
}

function Container49() {
  return (
    <div className="h-[52.8px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#1d293d] border-[0.8px_0px_0px] border-solid inset-0 pointer-events-none" />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[559.83px] not-italic text-[#90a1b9] text-[14px] text-center text-nowrap top-[31.6px] translate-x-[-50%] whitespace-pre">© 2025 MeetUp Café. All rights reserved.</p>
    </div>
  );
}

function Footer() {
  return (
    <div className="absolute bg-[#0f172b] content-stretch flex flex-col gap-[32px] h-[200.8px] items-start left-[16px] top-[2024.96px] w-[1119.2px]" data-name="Footer">
      <Container48 />
      <Container49 />
    </div>
  );
}

function HomePage11() {
  return (
    <div className="bg-slate-50 h-[2384px] relative shrink-0 w-full" data-name="HomePage">
      <Section />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Footer />
    </div>
  );
}

export default function MeetUpCafeApp() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col items-start pb-0 pt-[0.8px] px-0 relative size-full" data-name="MeetUp Café App">
      <App />
      <HomePage11 />
    </div>
  );
}