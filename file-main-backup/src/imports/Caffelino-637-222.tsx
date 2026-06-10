import svgPaths from "./svg-d3lahxhiug";

function Container() {
  return (
    <div className="absolute bg-[#e5e7eb] h-[36px] left-[256.86px] rounded-[2.68435e+07px] top-0 w-[222.275px]" data-name="Container">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[16px] not-italic text-[#364153] text-[14px] text-nowrap top-[6.8px]">{`Welcome to ddd's meetup! 🎉`}</p>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[28px] relative shrink-0 w-[24.725px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[28px] left-0 not-italic text-[#1e2939] text-[18px] text-nowrap top-[-1.4px]">👨</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[15.988px] relative shrink-0 w-[24.975px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arial:Bold',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#1e2939] text-[12px] text-nowrap">Alex</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex gap-[8px] h-[28px] items-center relative shrink-0 w-full" data-name="Container">
      <Text />
      <Text1 />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#1e2939] text-[14px] text-nowrap top-[-1.2px]">Hey everyone! Excited for this meetup! ☕</p>
    </div>
  );
}

function Text2() {
  return (
    <div className="content-stretch flex h-[15.988px] items-start relative shrink-0 w-full" data-name="Text">
      <p className="basis-0 font-['Arial:Regular',sans-serif] grow leading-[16px] min-h-px min-w-px not-italic relative shrink-0 text-[#6a7282] text-[12px]">11:12 PM</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[4px] h-[87.988px] items-start left-0 pb-0 pt-[8px] px-[16px] rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-[48px] w-[293.388px]" data-name="Container">
      <Container1 />
      <Paragraph />
      <Text2 />
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[28px] relative shrink-0 w-[24.725px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[28px] left-0 not-italic text-[#1e2939] text-[18px] text-nowrap top-[-1.4px]">👩</p>
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[15.988px] relative shrink-0 w-[31.65px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arial:Bold',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#1e2939] text-[12px] text-nowrap">Sarah</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex gap-[8px] h-[28px] items-center relative shrink-0 w-full" data-name="Container">
      <Text3 />
      <Text4 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#1e2939] text-[14px] text-nowrap top-[-1.2px]">{`Same here! Can't wait! 🎉`}</p>
    </div>
  );
}

function Text5() {
  return (
    <div className="content-stretch flex h-[15.988px] items-start relative shrink-0 w-full" data-name="Text">
      <p className="basis-0 font-['Arial:Regular',sans-serif] grow leading-[16px] min-h-px min-w-px not-italic relative shrink-0 text-[#6a7282] text-[12px]">11:13 PM</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[4px] h-[87.988px] items-start left-0 pb-0 pt-[8px] px-[16px] rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-[147.99px] w-[192.95px]" data-name="Container">
      <Container3 />
      <Paragraph1 />
      <Text5 />
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[235.975px] relative shrink-0 w-full" data-name="Container">
      <Container />
      <Container2 />
      <Container4 />
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex flex-col h-[396.8px] items-start left-[203.2px] overflow-clip pb-0 pt-[16px] px-[16px] top-[168px] w-[768px]" data-name="Container" style={{ backgroundImage: "linear-gradient(243.359deg, rgb(139, 89, 67) 1.444%, rgb(217, 191, 157) 50.058%, rgb(139, 89, 67) 99.616%)" }}>
      <Container5 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[12px] w-[84.138px]" data-name="Heading 3">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[20px] left-0 not-italic text-[#364153] text-[14px] top-[-1.2px] w-[85px]">Members (4)</p>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[28px] relative shrink-0 w-[24.725px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[28px] left-0 not-italic text-[#2c1810] text-[18px] text-nowrap top-[-1.4px]">👨</p>
      </div>
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[20px] relative shrink-0 w-[26.175px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#2c1810] text-[14px] text-nowrap top-[-1.2px]">Alex</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute bg-[#f3f4f6] content-stretch flex gap-[8px] h-[36px] items-center left-0 pl-[12px] pr-0 py-0 rounded-[2.68435e+07px] top-0 w-[82.9px]" data-name="Container">
      <Text6 />
      <Text7 />
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[28px] relative shrink-0 w-[24.725px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[28px] left-0 not-italic text-[#2c1810] text-[18px] text-nowrap top-[-1.4px]">👩</p>
      </div>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[20px] relative shrink-0 w-[34.475px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#2c1810] text-[14px] text-nowrap top-[-1.2px]">Sarah</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute bg-[#f3f4f6] content-stretch flex gap-[8px] h-[36px] items-center left-[90.9px] pl-[12px] pr-0 py-0 rounded-[2.68435e+07px] top-0 w-[91.2px]" data-name="Container">
      <Text8 />
      <Text9 />
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[28px] relative shrink-0 w-[24.725px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[28px] left-0 not-italic text-[#2c1810] text-[18px] text-nowrap top-[-1.4px]">👨‍💼</p>
      </div>
    </div>
  );
}

function Text11() {
  return (
    <div className="h-[20px] relative shrink-0 w-[30.25px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#2c1810] text-[14px] text-nowrap top-[-1.2px]">Mike</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute bg-[#f3f4f6] content-stretch flex gap-[8px] h-[36px] items-center left-[190.1px] pl-[12px] pr-0 py-0 rounded-[2.68435e+07px] top-0 w-[86.975px]" data-name="Container">
      <Text10 />
      <Text11 />
    </div>
  );
}

function Text12() {
  return (
    <div className="h-[28px] relative shrink-0 w-[24.725px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[28px] left-0 not-italic text-[#2c1810] text-[18px] text-nowrap top-[-1.4px]">👩‍💻</p>
      </div>
    </div>
  );
}

function Text13() {
  return (
    <div className="h-[20px] relative shrink-0 w-[38.325px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#2c1810] text-[14px] text-nowrap top-[-1.2px]">Emma</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute bg-[#f3f4f6] content-stretch flex gap-[8px] h-[36px] items-center left-[285.08px] pl-[12px] pr-0 py-0 rounded-[2.68435e+07px] top-0 w-[95.05px]" data-name="Container">
      <Text12 />
      <Text13 />
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute h-[36px] left-[16px] top-[40px] w-[736px]" data-name="Container">
      <Container7 />
      <Container8 />
      <Container9 />
      <Container10 />
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute bg-white border-[#e5e7eb] border-[0.8px_0px_0px] border-solid h-[88.8px] left-[203.2px] top-[564.8px] w-[768px]" data-name="Container">
      <Heading1 />
      <Container11 />
    </div>
  );
}

function MeetupChatBilling() {
  return (
    <div className="absolute bg-white h-[729.6px] left-0 top-0 w-[1174.4px]" data-name="MeetupChatBilling">
      <Container6 />
      <Container12 />
    </div>
  );
}

function TextInput() {
  return (
    <div className="basis-0 grow h-[51.2px] min-h-px min-w-px relative rounded-[2.68435e+07px] shrink-0" data-name="Text Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[16px] py-[12px] relative size-full">
          <p className="font-['Arial:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(44,24,16,0.5)] text-nowrap">Type a message...</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#d1d5dc] border-[1.6px] border-solid inset-0 pointer-events-none rounded-[2.68435e+07px]" />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_637_231)" id="Icon">
          <path d={svgPaths.p36f10880} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p8bd79c0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_637_231">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#be9d80] relative rounded-[2.68435e+07px] shrink-0 size-[48px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex gap-[8px] h-[51.2px] items-center relative shrink-0 w-full" data-name="Container">
      <TextInput />
      <Button />
    </div>
  );
}

function MeetupChatBilling1() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[76px] items-start left-[203.2px] pb-0 pt-[12.8px] px-[16px] top-[653.6px] w-[768px]" data-name="MeetupChatBilling">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.8px_0px_0px] border-solid inset-0 pointer-events-none" />
      <Container13 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-0 size-[20px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p33f6b680} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M15.8333 10H4.16667" id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[61.938px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon1 />
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-[45px] not-italic text-[#364153] text-[16px] text-center text-nowrap top-[-2.2px] translate-x-[-50%]">Back</p>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_637_226)" id="Icon">
          <path d={svgPaths.p22b32180} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pceec000} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2ecc1400} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_637_226">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#be9d80] h-[36px] relative rounded-[10px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0 w-[120.738px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon2 />
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[72px] not-italic text-[14px] text-center text-nowrap text-white top-[6.8px] translate-x-[-50%]">Order Food</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex h-[36px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Button1 />
      <Button2 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-0 size-[20px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M8.33333 1.66667V3.33333" id="Vector" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M11.6667 1.66667V3.33333" id="Vector_2" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p257a4f00} id="Vector_3" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M5 1.66667V3.33333" id="Vector_4" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 1">
      <Icon3 />
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[28px] left-[28px] not-italic text-[#101828] text-[18px] text-nowrap top-[-1.4px]">{`Brew & Bites`}</p>
    </div>
  );
}

function Text14() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-start left-[39.31px] top-[3.2px] w-[46.188px]" data-name="Text">
      <p className="font-['Consolas:Bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#be9d80] text-[14px] text-nowrap">RFG48Z</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[21.6px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#364153] text-[14px] text-nowrap top-[-1.2px]">Code:</p>
      <Text14 />
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[53.6px] relative shrink-0 w-[137.2px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Heading />
        <Paragraph2 />
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p32887f80} id="Vector" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p36436880} id="Vector_2" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1f197700} id="Vector_3" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3694d280} id="Vector_4" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text15() {
  return (
    <div className="absolute h-[20px] left-[24px] top-0 w-[8.063px]" data-name="Text">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[20px] left-0 not-italic text-[#101828] text-[14px] text-nowrap top-[-1.2px]">4</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <Icon4 />
      <Text15 />
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[40.06px] not-italic text-[#101828] text-[14px] text-nowrap top-[-1.2px]">members</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="bg-white h-[36px] relative rounded-[12px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0 w-[129.863px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-0 pt-[8px] px-[16px] relative size-full">
        <Paragraph3 />
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex h-[53.6px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container15 />
      <Container16 />
    </div>
  );
}

function Container18() {
  return (
    <div className="bg-gradient-to-b from-[#f5ebe0] h-[87.2px] relative rounded-[16px] shrink-0 to-[#e3d5ca] w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#be9d80] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex flex-col items-start pb-[0.8px] pt-[16.8px] px-[16.8px] relative size-full">
        <Container17 />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[167.2px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[12px] items-start pb-0 pt-[16px] px-[24px] relative size-full">
        <Container14 />
        <Container18 />
      </div>
    </div>
  );
}

function MeetupChatBilling2() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[168px] items-start left-0 pb-[0.8px] pt-0 px-[75.2px] top-0 w-[1174.4px]" data-name="MeetupChatBilling">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0px_0px_0.8px] border-solid inset-0 pointer-events-none shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <Container19 />
    </div>
  );
}

export default function Caffelino() {
  return (
    <div className="bg-[#fffbf5] relative size-full" data-name="caffelino">
      <MeetupChatBilling />
      <MeetupChatBilling1 />
      <MeetupChatBilling2 />
    </div>
  );
}