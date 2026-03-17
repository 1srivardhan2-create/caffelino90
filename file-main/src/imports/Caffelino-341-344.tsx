import svgPaths from "./svg-gacskslj4l";
import imgImageLogo from "figma:asset/6acfd9d6c8ee7fd0ee085b43918ec67ad605c2de.png";

function Heading() {
  return (
    <div className="h-[30px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[30px] left-0 not-italic text-[20px] text-black text-nowrap top-[-0.8px] whitespace-pre">Demo Meetup</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p2023d200} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" />
          <path d={svgPaths.p2d617c80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="relative shrink-0 size-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid size-0" />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex gap-[8px] h-[12px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon />
      <Text />
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[46px] relative shrink-0 w-[125.625px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] h-[46px] items-start relative w-[125.625px]">
        <Heading />
        <Container />
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-[98px] not-italic text-[14px] text-black text-right top-[0.4px] translate-x-[-100%] w-[98px]">Code: FGHJKH</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="bg-[rgba(255,255,255,0.2)] h-[37px] relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="content-stretch flex flex-col h-[37px] items-start pb-0 pt-[8px] px-[16px] relative w-full">
          <Paragraph />
        </div>
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[18px] left-[130.23px] not-italic text-[12px] text-black text-right top-[-0.4px] translate-x-[-100%] w-[61px]">2 members</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[59px] relative shrink-0 w-[129.25px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] h-[59px] items-start relative w-[129.25px]">
        <Container2 />
        <Paragraph1 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[59px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex h-[59px] items-center justify-between relative w-full">
          <Container1 />
          <Container3 />
        </div>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[10.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_341_348)" id="Icon">
          <path d={svgPaths.p2590ae00} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_341_348">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white h-[37px] relative rounded-[12px] shrink-0 w-[85.575px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[37px] relative w-[85.575px]">
        <Icon1 />
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-[55px] not-italic text-[14px] text-black text-center text-nowrap top-[8.4px] translate-x-[-50%] whitespace-pre">Chat</p>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[10.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1658d2c0} id="Vector" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p32916c80} id="Vector_2" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[rgba(255,255,255,0.2)] h-[37px] relative rounded-[12px] shrink-0 w-[125.013px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[37px] relative w-[125.013px]">
        <Icon2 />
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-[75px] not-italic text-[14px] text-black text-center text-nowrap top-[8.4px] translate-x-[-50%] whitespace-pre">View Menu</p>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[10.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p32887f80} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3baa1080} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p188b8380} id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3694d280} id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[rgba(255,255,255,0.2)] h-[37px] relative rounded-[12px] shrink-0 w-[114.35px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[37px] relative w-[114.35px]">
        <Icon3 />
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-[69.5px] not-italic text-[14px] text-black text-center text-nowrap top-[8.4px] translate-x-[-50%] whitespace-pre">Members</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex gap-[8px] h-[37px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <Button />
      <Button1 />
      <Button2 />
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[155px] items-start left-0 pb-0 pt-[16px] px-[16px] top-0 w-[1166px]" data-name="Container">
      <Container4 />
      <Container5 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-[547.91px] not-italic text-[#2c1810] text-[14px] text-center text-nowrap top-[0.4px] translate-x-[-50%] whitespace-pre">Welcome to Demo Meetup!</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[15px] opacity-70 relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[15px] left-[547.11px] not-italic text-[#2c1810] text-[10px] text-center text-nowrap top-[-1.2px] translate-x-[-50%] whitespace-pre">03:31 pm</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="bg-neutral-100 h-[64px] relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[4px] h-[64px] items-start pb-0 pt-[12px] px-[12px] relative w-full">
          <Paragraph2 />
          <Paragraph3 />
        </div>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[1119.2px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col h-full items-start overflow-clip relative rounded-[inherit] w-[1119.2px]">
        <Container7 />
      </div>
    </div>
  );
}

function TextInput() {
  return (
    <div className="basis-0 grow h-[46.6px] min-h-px min-w-px relative rounded-[12px] shrink-0" data-name="Text Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex h-[46.6px] items-center px-[16px] py-[12px] relative w-full">
          <p className="font-['Arial:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(44,24,16,0.5)] text-nowrap whitespace-pre">Type a message...</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-neutral-300 border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Icon4() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.32%_8.32%_8.33%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 19">
            <path d={svgPaths.p228d3dc0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.95%_8.94%_45.48%_45.47%]" data-name="Vector">
        <div className="absolute inset-[-9.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
            <path d={svgPaths.p2920ab80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#8b5943] h-[46.6px] relative rounded-[12px] shrink-0 w-[68px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col h-[46.6px] items-start pb-0 pt-[13.3px] px-[24px] relative w-[68px]">
        <Icon4 />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[46.6px] relative shrink-0 w-[1119.2px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] h-[46.6px] items-start relative w-[1119.2px]">
        <TextInput />
        <Button3 />
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p33c1b680} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.pd438b00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2fb16300} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[88.037px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[24px] relative w-[88.037px]">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-[44.5px] not-italic text-[16px] text-center text-nowrap text-white top-[0.2px] translate-x-[-50%] whitespace-pre">{`Order & Pay`}</p>
      </div>
    </div>
  );
}

function MeetupGroupPage() {
  return (
    <div className="bg-[#00a63e] h-[56px] relative rounded-[2.68435e+07px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 w-[172.038px]" data-name="MeetupGroupPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] h-[56px] items-center pl-[24px] pr-0 py-0 relative w-[172.038px]">
        <Icon5 />
        <Text1 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[449.6px] items-start left-[16px] top-[168px] w-[1119.2px]" data-name="Container">
      <Container8 />
      <Container9 />
      <MeetupGroupPage />
    </div>
  );
}

function MeetupGroupPage1() {
  return (
    <div className="bg-white h-[729.6px] relative shrink-0 w-full" data-name="MeetupGroupPage">
      <Container6 />
      <Container10 />
    </div>
  );
}

function AppContent() {
  return (
    <div className="absolute bg-slate-50 content-stretch flex flex-col h-[785.6px] items-start left-0 pb-0 pt-[56px] px-0 top-0 w-[1151.2px]" data-name="AppContent">
      <MeetupGroupPage1 />
    </div>
  );
}

function ImageLogo() {
  return (
    <div className="h-[40px] relative shrink-0 w-[133.325px]" data-name="Image (Logo)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgImageLogo} />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[40px] w-[133.325px]" />
    </div>
  );
}

function Container11() {
  return (
    <div className="bg-[rgba(255,255,255,0.2)] h-[36px] relative rounded-[2.68435e+07px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex h-[36px] items-center justify-center overflow-clip p-[1.6px] relative rounded-[inherit] w-full">
        <p className="font-['Arial:Regular',sans-serif] leading-[32px] not-italic relative shrink-0 text-[#2c1810] text-[24px] text-center text-nowrap whitespace-pre">🧑‍🎓</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.6px] border-[rgba(255,255,255,0.4)] border-solid inset-0 pointer-events-none rounded-[2.68435e+07px]" />
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[48px] size-[36px] top-0" data-name="Button">
      <Container11 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[87.5%_42.78%_8.33%_42.78%]" data-name="Vector">
        <div className="absolute inset-[-100.03%_-28.87%_-100.01%_-28.87%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 3">
            <path d={svgPaths.p1f8ebe00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_12.5%_29.17%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-6.67%_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 15">
            <path d={svgPaths.p259fd370} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pb-0 pt-[8px] px-[8px] rounded-[2.68435e+07px] size-[36px] top-0" data-name="Button">
      <Icon6 />
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[36px] relative shrink-0 w-[84px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[36px] relative w-[84px]">
        <Button4 />
        <Button5 />
      </div>
    </div>
  );
}

function AppContent1() {
  return (
    <div className="absolute bg-[#be9d80] content-stretch flex h-[55.2px] items-center justify-between left-0 pb-[0.8px] pt-0 px-[16px] top-0 w-[1166.4px]" data-name="AppContent">
      <div aria-hidden="true" className="absolute border-[0px_0px_0.8px] border-black border-solid inset-0 pointer-events-none shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <ImageLogo />
      <Container12 />
    </div>
  );
}

export default function Caffelino() {
  return (
    <div className="bg-[#fffbf5] relative size-full" data-name="caffelino">
      <AppContent />
      <AppContent1 />
    </div>
  );
}