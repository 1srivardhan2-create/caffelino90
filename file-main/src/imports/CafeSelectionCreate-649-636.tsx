import svgPaths from "./svg-f4u93hmk9g";
const imgImageCafeMocha = "/cafeMocha.png";
const imgImageTheCoffeeBean = "/theCoffeeBean.png";
const imgImageBrewBites = "/brewBites.png";
const imgImageUrbanGrind = "/urbanGrind.png";
const imgImageEspressoHouse = "/espressoHouse.png";
const imgImageChaiChatter = "/chaiChatter.png";
function Button() {
  return (
    <div className="h-[24px] relative shrink-0 w-[56.025px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <p className="font-['Arial:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#0a0a0a] text-[16px] text-center text-nowrap">← Back</p>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M8.33333 1.66667V3.33333" id="Vector" stroke="var(--stroke-0, #A8825D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M11.6667 1.66667V3.33333" id="Vector_2" stroke="var(--stroke-0, #A8825D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p257a4f00} id="Vector_3" stroke="var(--stroke-0, #A8825D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M5 1.66667V3.33333" id="Vector_4" stroke="var(--stroke-0, #A8825D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[27px] relative shrink-0 w-[97.05px]" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Bold',sans-serif] leading-[27px] left-0 not-italic text-[#0a0a0a] text-[18px] text-nowrap top-[0.2px]">Select Café</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[27px] relative shrink-0 w-[125.05px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Icon />
        <Heading />
      </div>
    </div>
  );
}

function Container1() {
  return <div className="h-0 shrink-0 w-[80px]" data-name="Container" />;
}

function Container2() {
  return (
    <div className="h-[59px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] py-0 relative size-full">
          <Button />
          <Container />
          <Container1 />
        </div>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[59.8px] items-start left-0 pb-[0.8px] pt-0 px-[60px] top-0 w-[1144px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0px_0px_0.8px] border-solid inset-0 pointer-events-none" />
      <Container2 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p127122c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
        </g>
      </svg>
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-[#00c950] relative rounded-[2.68435e+07px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon1 />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[21px] relative shrink-0 w-[45.913px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Bold',sans-serif] leading-[21px] left-0 not-italic text-[#0a0a0a] text-[14px] text-nowrap top-[0.4px]">Details</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[40px] relative shrink-0 w-[97.912px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container4 />
        <Text />
      </div>
    </div>
  );
}

function Container6() {
  return <div className="bg-[#00c950] h-[2px] shrink-0 w-[80px]" data-name="Container" />;
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p127122c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
        </g>
      </svg>
    </div>
  );
}

function Container7() {
  return (
    <div className="basis-0 bg-[#00c950] grow h-[40px] min-h-px min-w-px relative rounded-[2.68435e+07px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[21px] relative shrink-0 w-[35px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Bold',sans-serif] leading-[21px] left-0 not-italic text-[#0a0a0a] text-[14px] text-nowrap top-[0.4px]">Code</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[40px] relative shrink-0 w-[87px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container7 />
        <Text1 />
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[8.9px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#0a0a0a] text-[16px] text-nowrap top-[0.2px]">3</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="bg-[#c9b5a0] relative rounded-[2.68435e+07px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Text2 />
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[21px] relative shrink-0 w-[30.35px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Bold',sans-serif] leading-[21px] left-0 not-italic text-[#0a0a0a] text-[14px] text-nowrap top-[0.4px]">Café</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[40px] relative shrink-0 w-[82.35px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container9 />
        <Text3 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[40px] items-center justify-center left-[84px] pl-0 pr-[0.012px] py-0 top-[91.8px] w-[976px]" data-name="Container">
      <Container5 />
      <Container6 />
      <Container8 />
      <Container6 />
      <Container10 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p25397b80} id="Vector" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p166b7100} id="Vector_2" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2241fff0} id="Vector_3" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2c4f400} id="Vector_4" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Heading2() {
  return (
    <div className="basis-0 grow h-[27px] min-h-px min-w-px relative shrink-0" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Bold',sans-serif] leading-[27px] left-0 not-italic text-[#101828] text-[18px] top-[0.2px] w-[122px]">{`rtyui's Meetup`}</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex gap-[8px] h-[27px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon3 />
      <Heading2 />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#364153] text-[14px] top-[0.4px] w-[131px]">Fri, Jan 16 • 6:06 PM</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[52px] relative shrink-0 w-[149.313px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Container12 />
        <Paragraph />
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Consolas:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#be9d80] text-[16px] text-nowrap top-[-0.6px] tracking-[1.6px]">AJIZDN</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="bg-white h-[40px] relative rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0 w-[94.388px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-0 pt-[8px] px-[16px] relative size-full">
        <Paragraph1 />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[52px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between relative size-full">
          <Container13 />
          <Container14 />
        </div>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p32887f80} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p36436880} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1f197700} id="Vector_3" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3694d280} id="Vector_4" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[21px] relative shrink-0 w-[82.475px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Bold',sans-serif] leading-[21px] left-0 not-italic text-[#364153] text-[14px] top-[0.4px] w-[83px]">Members (4)</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon4 />
      <Text4 />
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[27px] relative shrink-0 w-[24.725px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[27px] left-0 not-italic text-[#2c1810] text-[18px] text-nowrap top-[-2.2px]">👨</p>
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[21px] relative shrink-0 w-[27.238px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#364153] text-[14px] text-nowrap top-[0.4px]">Alex</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[8px] h-[43px] items-center left-0 pl-[12px] pr-0 py-0 rounded-[2.68435e+07px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-0 w-[83.963px]" data-name="Container">
      <Text5 />
      <Text6 />
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[27px] relative shrink-0 w-[24.725px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[27px] left-0 not-italic text-[#2c1810] text-[18px] text-nowrap top-[-2.2px]">👩</p>
      </div>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[21px] relative shrink-0 w-[37.362px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#364153] text-[14px] text-nowrap top-[0.4px]">Sarah</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[8px] h-[43px] items-center left-[91.96px] pl-[12px] pr-0 py-0 rounded-[2.68435e+07px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-0 w-[94.088px]" data-name="Container">
      <Text7 />
      <Text8 />
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[27px] relative shrink-0 w-[24.725px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[27px] left-0 not-italic text-[#2c1810] text-[18px] text-nowrap top-[-2.2px]">👨‍💼</p>
      </div>
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[21px] relative shrink-0 w-[29.563px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#364153] text-[14px] text-nowrap top-[0.4px]">Mike</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[8px] h-[43px] items-center left-[194.05px] pl-[12px] pr-0 py-0 rounded-[2.68435e+07px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-0 w-[86.287px]" data-name="Container">
      <Text9 />
      <Text10 />
    </div>
  );
}

function Text11() {
  return (
    <div className="h-[27px] relative shrink-0 w-[24.725px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[27px] left-0 not-italic text-[#2c1810] text-[18px] text-nowrap top-[-2.2px]">👩‍💻</p>
      </div>
    </div>
  );
}

function Text12() {
  return (
    <div className="h-[21px] relative shrink-0 w-[40.45px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#364153] text-[14px] text-nowrap top-[0.4px]">Emma</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[8px] h-[43px] items-center left-[288.34px] pl-[12px] pr-0 py-0 rounded-[2.68435e+07px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-0 w-[97.175px]" data-name="Container">
      <Text11 />
      <Text12 />
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[43px] relative shrink-0 w-full" data-name="Container">
      <Container17 />
      <Container18 />
      <Container19 />
      <Container20 />
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[92.8px] items-start pb-0 pt-[16.8px] px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.8px_0px_0px] border-[rgba(190,157,128,0.3)] border-solid inset-0 pointer-events-none" />
      <Container16 />
      <Container21 />
    </div>
  );
}

function Container23() {
  return (
    <div className="bg-gradient-to-b from-[#f5ebe0] h-[210.4px] relative rounded-[16px] shrink-0 to-[#e3d5ca] w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#be9d80] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start pb-[0.8px] pt-[24.8px] px-[24.8px] relative size-full">
        <Container15 />
        <Container22 />
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[27px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[27px] left-0 not-italic text-[#101828] text-[18px] text-nowrap top-[0.2px]">Enable Voting</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.4px]">Select 3 cafés for members to vote</p>
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[52px] items-start left-0 top-0 w-[216.325px]" data-name="Container">
      <Heading4 />
      <Paragraph2 />
    </div>
  );
}

function Container25() {
  return <div className="bg-white h-[24px] rounded-[2.68435e+07px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Container" />;
}

function Button1() {
  return (
    <div className="absolute bg-[#00c950] content-stretch flex flex-col h-[32px] items-start left-[862.4px] pb-0 pl-[36px] pr-[4px] pt-[4px] rounded-[2.68435e+07px] top-[10px] w-[64px]" data-name="Button">
      <Container25 />
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[52px] relative shrink-0 w-full" data-name="Container">
      <Container24 />
      <Button1 />
    </div>
  );
}

function Container27() {
  return (
    <div className="bg-white h-[101.6px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <div className="content-stretch flex flex-col items-start pb-[0.8px] pt-[24.8px] px-[24.8px] relative size-full">
        <Container26 />
      </div>
    </div>
  );
}

function TextInput() {
  return (
    <div className="absolute bg-[rgba(168,130,93,0.15)] h-[59.2px] left-0 rounded-[16px] top-0 w-[976px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip pl-[48px] pr-[16px] py-[16px] relative rounded-[inherit] size-full">
        <p className="font-['Arial:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#2c1810] text-[16px] text-nowrap">Search cafés by name or area</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#a8825d] border-[1.6px] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function Icon5() {
  return (
    <div className="absolute left-[16px] size-[20px] top-[19.6px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M17.5 17.5L13.8833 13.8833" id="Vector" stroke="var(--stroke-0, #2C1810)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pcddfd00} id="Vector_2" stroke="var(--stroke-0, #2C1810)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container28() {
  return (
    <div className="h-[59.2px] relative shrink-0 w-full" data-name="Container">
      <TextInput />
      <Icon5 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[27px] relative shrink-0 w-[122.075px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Bold',sans-serif] leading-[27px] left-0 not-italic text-[#101828] text-[18px] text-nowrap top-[0.2px]">Select 3 Cafés</p>
      </div>
    </div>
  );
}

function Text13() {
  return (
    <div className="h-[21px] relative shrink-0 w-[83.287px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#1e1e1e] text-[14px] top-[0.4px] w-[84px]">3 / 3 selected</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex h-[27px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Heading1 />
      <Text13 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] text-nowrap top-[0.2px]">Café Mocha</p>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p14548f00} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17781bc0} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text14() {
  return (
    <div className="h-[21px] relative shrink-0 w-[83.287px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.4px]">Koramangala</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon6 />
      <Text14 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1cb7cc00} fill="var(--fill-0, #FFB900)" id="Vector" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text15() {
  return (
    <div className="h-[21px] relative shrink-0 w-[19.462px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.4px]">4.5</p>
      </div>
    </div>
  );
}

function Text16() {
  return (
    <div className="h-[21px] relative shrink-0 w-[4.912px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#99a1af] text-[14px] text-nowrap top-[0.4px]">•</p>
      </div>
    </div>
  );
}

function Text17() {
  return (
    <div className="h-[21px] relative shrink-0 w-[85.825px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#6a7282] text-[14px] text-nowrap top-[0.4px]">{`Cozy & Warm`}</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon7 />
      <Text15 />
      <Text16 />
      <Text17 />
    </div>
  );
}

function Text18() {
  return (
    <div className="h-[24px] relative shrink-0 w-[35.6px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#be9d80] text-[16px] top-[0.2px] w-[36px]">₹250</p>
      </div>
    </div>
  );
}

function Text19() {
  return (
    <div className="h-[21px] relative shrink-0 w-[66.938px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#6a7282] text-[14px] text-nowrap top-[0.4px]">per person</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex gap-[8px] h-[32.8px] items-center pb-0 pt-[0.8px] px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-[0.8px_0px_0px] border-solid inset-0 pointer-events-none" />
      <Text18 />
      <Text19 />
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[90.8px] items-start relative shrink-0 w-full" data-name="Container">
      <Container30 />
      <Container31 />
      <Container32 />
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[154.8px] items-start left-0 pb-0 pt-[16px] px-[16px] top-[160px] w-[311.462px]" data-name="Container">
      <Heading3 />
      <Container33 />
    </div>
  );
}

function ImageCafeMocha() {
  return (
    <div className="h-[160px] relative shrink-0 w-full" data-name="Image (Café Mocha)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageCafeMocha} />
    </div>
  );
}

function Container35() {
  return (
    <div className="absolute content-stretch flex flex-col h-[160px] items-start left-0 overflow-clip top-0 w-[311.462px]" data-name="Container">
      <ImageCafeMocha />
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute bg-white border-[#e5e7eb] border-[1.6px] border-solid h-[318px] left-0 overflow-clip rounded-[16px] top-0 w-[314.663px]" data-name="Button">
      <Container34 />
      <Container35 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] text-nowrap top-[0.2px]">The Coffee Bean</p>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p14548f00} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17781bc0} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text20() {
  return (
    <div className="h-[21px] relative shrink-0 w-[70.838px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.4px]">Indiranagar</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon8 />
      <Text20 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1cb7cc00} fill="var(--fill-0, #FFB900)" id="Vector" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text21() {
  return (
    <div className="h-[21px] relative shrink-0 w-[19.462px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.4px]">4.3</p>
      </div>
    </div>
  );
}

function Text22() {
  return (
    <div className="h-[21px] relative shrink-0 w-[4.912px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#99a1af] text-[14px] text-nowrap top-[0.4px]">•</p>
      </div>
    </div>
  );
}

function Text23() {
  return (
    <div className="h-[21px] relative shrink-0 w-[62.237px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#6a7282] text-[14px] text-nowrap top-[0.4px]">Minimalist</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon9 />
      <Text21 />
      <Text22 />
      <Text23 />
    </div>
  );
}

function Text24() {
  return (
    <div className="h-[24px] relative shrink-0 w-[35.6px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#be9d80] text-[16px] top-[0.2px] w-[36px]">₹180</p>
      </div>
    </div>
  );
}

function Text25() {
  return (
    <div className="h-[21px] relative shrink-0 w-[66.938px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#6a7282] text-[14px] text-nowrap top-[0.4px]">per person</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex gap-[8px] h-[32.8px] items-center pb-0 pt-[0.8px] px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-[0.8px_0px_0px] border-solid inset-0 pointer-events-none" />
      <Text24 />
      <Text25 />
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[90.8px] items-start relative shrink-0 w-full" data-name="Container">
      <Container36 />
      <Container37 />
      <Container38 />
    </div>
  );
}

function Container40() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[154.8px] items-start left-0 pb-0 pt-[16px] px-[16px] top-[160px] w-[311.462px]" data-name="Container">
      <Heading5 />
      <Container39 />
    </div>
  );
}

function ImageTheCoffeeBean() {
  return (
    <div className="h-[160px] relative shrink-0 w-full" data-name="Image (The Coffee Bean)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageTheCoffeeBean} />
    </div>
  );
}

function Container41() {
  return (
    <div className="absolute content-stretch flex flex-col h-[160px] items-start left-0 overflow-clip top-0 w-[311.462px]" data-name="Container">
      <ImageTheCoffeeBean />
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute bg-white border-[#e5e7eb] border-[1.6px] border-solid h-[318px] left-[330.66px] overflow-clip rounded-[16px] top-0 w-[314.663px]" data-name="Button">
      <Container40 />
      <Container41 />
    </div>
  );
}

function Heading6() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] text-nowrap top-[0.2px]">{`Brew & Bites`}</p>
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p14548f00} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17781bc0} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text26() {
  return (
    <div className="h-[21px] relative shrink-0 w-[75.488px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.4px]">HSR Layout</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon10 />
      <Text26 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pb3a1300} fill="var(--fill-0, #FFB900)" id="Vector" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text27() {
  return (
    <div className="h-[21px] relative shrink-0 w-[19.462px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.4px]">4.7</p>
      </div>
    </div>
  );
}

function Text28() {
  return (
    <div className="h-[21px] relative shrink-0 w-[4.912px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#99a1af] text-[14px] text-nowrap top-[0.4px]">•</p>
      </div>
    </div>
  );
}

function Text29() {
  return (
    <div className="h-[21px] relative shrink-0 w-[56.013px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#6a7282] text-[14px] text-nowrap top-[0.4px]">Premium</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon11 />
      <Text27 />
      <Text28 />
      <Text29 />
    </div>
  );
}

function Text30() {
  return (
    <div className="h-[24px] relative shrink-0 w-[35.6px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#be9d80] text-[16px] top-[0.2px] w-[36px]">₹300</p>
      </div>
    </div>
  );
}

function Text31() {
  return (
    <div className="h-[21px] relative shrink-0 w-[66.938px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#6a7282] text-[14px] text-nowrap top-[0.4px]">per person</p>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="content-stretch flex gap-[8px] h-[32.8px] items-center pb-0 pt-[0.8px] px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-[0.8px_0px_0px] border-solid inset-0 pointer-events-none" />
      <Text30 />
      <Text31 />
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[90.8px] items-start relative shrink-0 w-full" data-name="Container">
      <Container42 />
      <Container43 />
      <Container44 />
    </div>
  );
}

function Container46() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[154.8px] items-start left-0 pb-0 pt-[16px] px-[16px] top-[160px] w-[311.475px]" data-name="Container">
      <Heading6 />
      <Container45 />
    </div>
  );
}

function ImageBrewBites() {
  return (
    <div className="h-[160px] relative shrink-0 w-full" data-name="Image (Brew & Bites)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageBrewBites} />
    </div>
  );
}

function Container47() {
  return (
    <div className="absolute content-stretch flex flex-col h-[160px] items-start left-0 overflow-clip top-0 w-[311.475px]" data-name="Container">
      <ImageBrewBites />
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute bg-white border-[#e5e7eb] border-[1.6px] border-solid h-[318px] left-[661.33px] overflow-clip rounded-[16px] top-0 w-[314.675px]" data-name="Button">
      <Container46 />
      <Container47 />
    </div>
  );
}

function ImageUrbanGrind() {
  return (
    <div className="absolute h-[163.2px] left-0 top-0 w-[317.692px]" data-name="Image (Urban Grind)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageUrbanGrind} />
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[20.4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.4 20.4">
        <g id="Icon">
          <path d={svgPaths.p3f227900} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.55" />
        </g>
      </svg>
    </div>
  );
}

function Container48() {
  return (
    <div className="absolute bg-[#00c950] content-stretch flex items-center justify-center left-[272.81px] rounded-[2.68435e+07px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[32.64px] top-[12.24px]" data-name="Container">
      <Icon12 />
    </div>
  );
}

function Container49() {
  return (
    <div className="h-[163.2px] overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageUrbanGrind />
      <Container48 />
    </div>
  );
}

function Heading7() {
  return (
    <div className="h-[24.48px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] text-nowrap top-[0.26px]">Urban Grind</p>
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[16.32px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.32 16.32">
        <g id="Icon">
          <path d={svgPaths.p3a67ad00} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.36" />
          <path d={svgPaths.p2f661480} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.36" />
        </g>
      </svg>
    </div>
  );
}

function Text32() {
  return (
    <div className="h-[21.42px] relative shrink-0 w-[62.705px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.45px]">Whitefield</p>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex gap-[8.16px] h-[21.42px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon13 />
      <Text32 />
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[16.32px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.32 16.32">
        <g id="Icon">
          <path d={svgPaths.p19155a80} fill="var(--fill-0, #FFB900)" id="Vector" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.36" />
        </g>
      </svg>
    </div>
  );
}

function Text33() {
  return (
    <div className="h-[21.42px] relative shrink-0 w-[19.852px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.45px]">4.4</p>
      </div>
    </div>
  );
}

function Text34() {
  return (
    <div className="h-[21.42px] relative shrink-0 w-[5.011px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#99a1af] text-[14px] text-nowrap top-[0.45px]">•</p>
      </div>
    </div>
  );
}

function Text35() {
  return (
    <div className="h-[21.42px] relative shrink-0 w-[48.425px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#6a7282] text-[14px] text-nowrap top-[0.45px]">Modern</p>
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="content-stretch flex gap-[8.16px] h-[21.42px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon14 />
      <Text33 />
      <Text34 />
      <Text35 />
    </div>
  );
}

function Text36() {
  return (
    <div className="h-[24.48px] relative shrink-0 w-[36.312px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#be9d80] text-[16px] top-[0.26px] w-[37px]">₹220</p>
      </div>
    </div>
  );
}

function Text37() {
  return (
    <div className="h-[21.42px] relative shrink-0 w-[68.276px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#6a7282] text-[14px] text-nowrap top-[0.45px]">per person</p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex gap-[8.16px] h-[33.456px] items-center pb-0 pt-[0.8px] px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-[0.8px_0px_0px] border-solid inset-0 pointer-events-none" />
      <Text36 />
      <Text37 />
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex flex-col gap-[8.16px] h-[92.616px] items-start relative shrink-0 w-full" data-name="Container">
      <Container50 />
      <Container51 />
      <Container52 />
    </div>
  );
}

function Container54() {
  return (
    <div className="h-[157.896px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[8.16px] items-start pb-0 pt-[16.32px] px-[16.32px] relative size-full">
        <Heading7 />
        <Container53 />
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute bg-white h-[324.36px] left-[-3.15px] rounded-[16px] top-[330.82px] w-[320.956px]" data-name="Button">
      <div className="content-stretch flex flex-col items-start overflow-clip pb-[1.6px] pt-[1.632px] px-[1.632px] relative rounded-[inherit] size-full">
        <Container49 />
        <Container54 />
      </div>
      <div aria-hidden="true" className="absolute border-[#00c950] border-[1.6px] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function ImageEspressoHouse() {
  return (
    <div className="absolute h-[163.2px] left-0 top-0 w-[317.692px]" data-name="Image (Espresso House)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageEspressoHouse} />
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[20.4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.4 20.4">
        <g id="Icon">
          <path d={svgPaths.p3f227900} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.55" />
        </g>
      </svg>
    </div>
  );
}

function Container55() {
  return (
    <div className="absolute bg-[#00c950] content-stretch flex items-center justify-center left-[272.81px] rounded-[2.68435e+07px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[32.64px] top-[12.24px]" data-name="Container">
      <Icon15 />
    </div>
  );
}

function Container56() {
  return (
    <div className="h-[163.2px] overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageEspressoHouse />
      <Container55 />
    </div>
  );
}

function Heading8() {
  return (
    <div className="h-[24.48px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] text-nowrap top-[0.26px]">Espresso House</p>
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[16.32px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.32 16.32">
        <g id="Icon">
          <path d={svgPaths.p5ca4000} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.36" />
          <path d={svgPaths.p31b89e00} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.36" />
        </g>
      </svg>
    </div>
  );
}

function Text38() {
  return (
    <div className="h-[21.42px] relative shrink-0 w-[61.111px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.45px]">MG Road</p>
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div className="content-stretch flex gap-[8.16px] h-[21.42px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon16 />
      <Text38 />
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[16.32px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.32 16.32">
        <g id="Icon">
          <path d={svgPaths.p2a516e80} fill="var(--fill-0, #FFB900)" id="Vector" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.36" />
        </g>
      </svg>
    </div>
  );
}

function Text39() {
  return (
    <div className="h-[21.42px] relative shrink-0 w-[19.852px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.45px]">4.6</p>
      </div>
    </div>
  );
}

function Text40() {
  return (
    <div className="h-[21.42px] relative shrink-0 w-[5.011px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#99a1af] text-[14px] text-nowrap top-[0.45px]">•</p>
      </div>
    </div>
  );
}

function Text41() {
  return (
    <div className="h-[21.42px] relative shrink-0 w-[46.027px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#6a7282] text-[14px] text-nowrap top-[0.45px]">Classic</p>
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="content-stretch flex gap-[8.16px] h-[21.42px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon17 />
      <Text39 />
      <Text40 />
      <Text41 />
    </div>
  );
}

function Text42() {
  return (
    <div className="h-[24.48px] relative shrink-0 w-[36.312px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#be9d80] text-[16px] top-[0.26px] w-[37px]">₹200</p>
      </div>
    </div>
  );
}

function Text43() {
  return (
    <div className="h-[21.42px] relative shrink-0 w-[68.276px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#6a7282] text-[14px] text-nowrap top-[0.45px]">per person</p>
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="content-stretch flex gap-[8.16px] h-[33.456px] items-center pb-0 pt-[0.8px] px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-[0.8px_0px_0px] border-solid inset-0 pointer-events-none" />
      <Text42 />
      <Text43 />
    </div>
  );
}

function Container60() {
  return (
    <div className="content-stretch flex flex-col gap-[8.16px] h-[92.616px] items-start relative shrink-0 w-full" data-name="Container">
      <Container57 />
      <Container58 />
      <Container59 />
    </div>
  );
}

function Container61() {
  return (
    <div className="h-[157.896px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[8.16px] items-start pb-0 pt-[16.32px] px-[16.32px] relative size-full">
        <Heading8 />
        <Container60 />
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute bg-white h-[324.36px] left-[327.52px] rounded-[16px] top-[330.82px] w-[320.956px]" data-name="Button">
      <div className="content-stretch flex flex-col items-start overflow-clip pb-[1.6px] pt-[1.632px] px-[1.632px] relative rounded-[inherit] size-full">
        <Container56 />
        <Container61 />
      </div>
      <div aria-hidden="true" className="absolute border-[#00c950] border-[1.6px] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function ImageChaiChatter() {
  return (
    <div className="absolute h-[163.2px] left-0 top-0 w-[317.705px]" data-name="Image (Chai & Chatter)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageChaiChatter} />
    </div>
  );
}

function Icon18() {
  return (
    <div className="relative shrink-0 size-[20.4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.4 20.4">
        <g id="Icon">
          <path d={svgPaths.p328fd200} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.55" />
        </g>
      </svg>
    </div>
  );
}

function Container62() {
  return (
    <div className="absolute bg-[#00c950] content-stretch flex items-center justify-center left-[272.82px] rounded-[2.68435e+07px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[32.64px] top-[12.24px]" data-name="Container">
      <Icon18 />
    </div>
  );
}

function Container63() {
  return (
    <div className="h-[163.2px] overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageChaiChatter />
      <Container62 />
    </div>
  );
}

function Heading9() {
  return (
    <div className="h-[24.48px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] text-nowrap top-[0.26px]">{`Chai & Chatter`}</p>
    </div>
  );
}

function Icon19() {
  return (
    <div className="relative shrink-0 size-[16.32px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.32 16.32">
        <g id="Icon">
          <path d={svgPaths.p5ca4000} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.36" />
          <path d={svgPaths.p31b89e00} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.36" />
        </g>
      </svg>
    </div>
  );
}

function Text44() {
  return (
    <div className="h-[21.42px] relative shrink-0 w-[66.695px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.45px]">Jayanagar</p>
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div className="content-stretch flex gap-[8.16px] h-[21.42px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon19 />
      <Text44 />
    </div>
  );
}

function Icon20() {
  return (
    <div className="relative shrink-0 size-[16.32px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.32 16.32">
        <g id="Icon">
          <path d={svgPaths.p3e0d5a80} fill="var(--fill-0, #FFB900)" id="Vector" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.36" />
        </g>
      </svg>
    </div>
  );
}

function Text45() {
  return (
    <div className="h-[21.42px] relative shrink-0 w-[19.852px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.45px]">4.2</p>
      </div>
    </div>
  );
}

function Text46() {
  return (
    <div className="h-[21.42px] relative shrink-0 w-[5.011px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#99a1af] text-[14px] text-nowrap top-[0.45px]">•</p>
      </div>
    </div>
  );
}

function Text47() {
  return (
    <div className="h-[21.42px] relative shrink-0 w-[44.459px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#6a7282] text-[14px] text-nowrap top-[0.45px]">Casual</p>
      </div>
    </div>
  );
}

function Container65() {
  return (
    <div className="content-stretch flex gap-[8.16px] h-[21.42px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon20 />
      <Text45 />
      <Text46 />
      <Text47 />
    </div>
  );
}

function Text48() {
  return (
    <div className="h-[24.48px] relative shrink-0 w-[36.312px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#be9d80] text-[16px] top-[0.26px] w-[37px]">₹150</p>
      </div>
    </div>
  );
}

function Text49() {
  return (
    <div className="h-[21.42px] relative shrink-0 w-[68.276px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#6a7282] text-[14px] text-nowrap top-[0.45px]">per person</p>
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div className="content-stretch flex gap-[8.16px] h-[33.456px] items-center pb-0 pt-[0.8px] px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-[0.8px_0px_0px] border-solid inset-0 pointer-events-none" />
      <Text48 />
      <Text49 />
    </div>
  );
}

function Container67() {
  return (
    <div className="content-stretch flex flex-col gap-[8.16px] h-[92.616px] items-start relative shrink-0 w-full" data-name="Container">
      <Container64 />
      <Container65 />
      <Container66 />
    </div>
  );
}

function Container68() {
  return (
    <div className="h-[157.896px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[8.16px] items-start pb-0 pt-[16.32px] px-[16.32px] relative size-full">
        <Heading9 />
        <Container67 />
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute bg-white h-[324.36px] left-[658.18px] rounded-[16px] top-[330.82px] w-[320.968px]" data-name="Button">
      <div className="content-stretch flex flex-col items-start overflow-clip pb-[1.6px] pt-[1.632px] px-[1.632px] relative rounded-[inherit] size-full">
        <Container63 />
        <Container68 />
      </div>
      <div aria-hidden="true" className="absolute border-[#00c950] border-[1.6px] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container69() {
  return (
    <div className="h-[652px] relative shrink-0 w-full" data-name="Container">
      <Button2 />
      <Button3 />
      <Button4 />
      <Button5 />
      <Button6 />
      <Button7 />
    </div>
  );
}

function Container70() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[695px] items-start relative shrink-0 w-full" data-name="Container">
      <Container29 />
      <Container69 />
    </div>
  );
}

function Container71() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] h-[1138.2px] items-start left-[60px] px-[24px] py-0 top-[163.8px] w-[1024px]" data-name="Container">
      <Container23 />
      <Container27 />
      <Container28 />
      <Container70 />
    </div>
  );
}

export default function CafeSelectionCreate() {
  return (
    <div className="bg-gradient-to-b from-[#8b5943] relative size-full to-[#8b5943] via-[#d9bf9d] via-[48.558%]" data-name="CafeSelectionCreate">
      <Container3 />
      <Container11 />
      <Container71 />
    </div>
  );
}