import svgPaths from "./svg-618nm5ppqz";
const imgImageLogo = "/logo.png";
function Heading() {
  return (
    <div className="absolute h-[27px] left-0 top-0 w-[351.725px]" data-name="Heading 3">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[27px] left-0 not-italic text-[18px] text-nowrap text-white top-[-2.2px] whitespace-pre">Caffélino</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[21px] left-0 top-[39px] w-[351.725px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#cad5e2] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">Connect with real people over real conversations.</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[9.2px] size-[16px] top-[9.2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_434_619)" id="Icon">
          <path d={svgPaths.p22916300} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p8d16f00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M11.6667 4.33333H11.6733" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_434_619">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Link() {
  return (
    <div className="absolute border-[#45556c] border-[0.8px] border-solid left-0 rounded-[2.68435e+07px] size-[36px] top-[76px]" data-name="Link">
      <Icon />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute h-[124px] left-[16px] top-[48px] w-[351.725px]" data-name="Container">
      <Heading />
      <Paragraph />
      <Link />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-[-2.2px] whitespace-pre">Quick Links</p>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute h-[21px] left-0 top-[2.4px] w-[37.525px]" data-name="Button">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#cad5e2] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">Home</p>
    </div>
  );
}

function ListItem() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button />
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute h-[21px] left-0 top-[2.4px] w-[67.275px]" data-name="Button">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#cad5e2] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">Contact Us</p>
    </div>
  );
}

function ListItem1() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button1 />
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[56px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem />
      <ListItem1 />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[124px] items-start left-[399.73px] top-[48px] w-[351.738px]" data-name="Container">
      <Heading1 />
      <List />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-[-2.2px] whitespace-pre">Legal</p>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute h-[21px] left-0 top-[2.4px] w-[57.525px]" data-name="Button">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#cad5e2] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">About Us</p>
    </div>
  );
}

function ListItem2() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button2 />
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute h-[21px] left-0 top-[2.4px] w-[82.9px]" data-name="Button">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#cad5e2] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">How It Works</p>
    </div>
  );
}

function ListItem3() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button3 />
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute h-[21px] left-0 top-[2.4px] w-[106.075px]" data-name="Button">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#cad5e2] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">Safety Guidelines</p>
    </div>
  );
}

function ListItem4() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button4 />
    </div>
  );
}

function List1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[88px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem2 />
      <ListItem3 />
      <ListItem4 />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[124px] items-start left-[783.46px] top-[48px] w-[351.725px]" data-name="Container">
      <Heading2 />
      <List1 />
    </div>
  );
}

function Footer() {
  return (
    <div className="absolute bg-[#1a2332] h-[252px] left-0 top-[1735.9px] w-[1151.2px]" data-name="Footer">
      <Container />
      <Container1 />
      <Container2 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p25397b80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p18406864} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2241fff0} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2c4f400} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-[#8b5943] relative rounded-[2.68435e+07px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon1 />
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="basis-0 grow h-[40px] min-h-px min-w-px relative shrink-0" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[40px] left-0 not-italic text-[28px] text-neutral-950 text-nowrap top-0 whitespace-pre">Your Meetups</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[211.75px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container3 />
        <Paragraph1 />
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="relative shrink-0 size-[100px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid size-full" />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[133.85px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[14px] text-neutral-600 text-nowrap top-[-0.4px] whitespace-pre">All your active groups</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[68px] items-start left-0 pl-[4px] pr-0 py-0 top-0 w-[1103.2px]" data-name="Container">
      <Container4 />
      <Frame />
      <Paragraph2 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[27px] relative shrink-0 w-[129.238px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[27px] left-0 not-italic text-[18px] text-neutral-950 text-nowrap top-[-2.2px] whitespace-pre">{`xxxsds's Meetup`}</p>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[8.8px] size-[12px] top-[4.3px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p1d913500} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2.5 10.5H9.5" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Badge() {
  return (
    <div className="bg-[#be9d80] h-[20.6px] relative rounded-[10px] shrink-0 w-[71.188px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <Icon2 />
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[15px] left-[28.8px] not-italic text-[10px] text-nowrap text-white top-[1.6px] whitespace-pre">Creator</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#be9d80] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex gap-[8px] h-[27px] items-center relative shrink-0 w-full" data-name="Container">
      <Heading3 />
      <Badge />
    </div>
  );
}

function Text() {
  return (
    <div className="h-[18px] relative shrink-0 w-[30.413px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[18px] left-0 not-italic text-[12px] text-neutral-600 text-nowrap top-[-1.2px] whitespace-pre">Code:</p>
      </div>
    </div>
  );
}

function Code() {
  return (
    <div className="bg-[rgba(190,157,128,0.1)] h-[23.5px] relative rounded-[4px] shrink-0 w-[58.888px]" data-name="Code">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Consolas:Regular',sans-serif] leading-[19.5px] left-[8px] not-italic text-[#8b5943] text-[13px] text-nowrap top-[1.6px] whitespace-pre">9OIAY4</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex gap-[8px] h-[23.5px] items-center relative shrink-0 w-full" data-name="Container">
      <Text />
      <Code />
    </div>
  );
}

function Container8() {
  return (
    <div className="basis-0 grow h-[66.5px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Container6 />
        <Container7 />
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_434_651)" id="Icon">
          <path d={svgPaths.p3eaa2980} id="Vector" stroke="var(--stroke-0, #008236)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1f2c5400} id="Vector_2" stroke="var(--stroke-0, #008236)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_434_651">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[18px] relative shrink-0 w-[41.4px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[18px] left-0 not-italic text-[#008236] text-[12px] text-nowrap top-[-1.2px] whitespace-pre">Created</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="bg-green-100 h-[31.6px] relative rounded-[2.68435e+07px] shrink-0 w-[89px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#b9f8cf] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[2.68435e+07px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center pl-[12.8px] pr-[0.8px] py-[0.8px] relative size-full">
        <Icon3 />
        <Text1 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[66.5px] relative shrink-0 w-[1052px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Container8 />
        <Container9 />
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M5.33333 1.33333V4" id="Vector" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 1.33333V4" id="Vector_2" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3ee34580} id="Vector_3" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 6.66667H14" id="Vector_4" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[21px] relative shrink-0 w-[119.275px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[14px] text-neutral-600 text-nowrap top-[-1.2px] whitespace-pre">Sun, 28 Dec • 17:04</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon4 />
      <Text2 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p14548f00} id="Vector" stroke="var(--stroke-0, #A1A1A1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17781bc0} id="Vector_2" stroke="var(--stroke-0, #A1A1A1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[21px] relative shrink-0 w-[124.75px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Arial:Italic',sans-serif] italic leading-[21px] left-0 text-[#a1a1a1] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">Café not selected yet</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon5 />
      <Text3 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p32887f80} id="Vector" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3b6ee540} id="Vector_2" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p188b8380} id="Vector_3" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3694d280} id="Vector_4" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[21px] relative shrink-0 w-[63.25px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[14px] text-neutral-600 top-[-1.2px] w-[64px]">1 member</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon6 />
      <Text4 />
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[79px] relative shrink-0 w-[1052px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Container11 />
        <Container12 />
        <Container13 />
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#be9d80] h-[44px] relative rounded-[10px] shrink-0 w-[1052px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[16px] py-[8px] relative size-full">
        <p className="font-['Arial:Regular',sans-serif] leading-[22.5px] not-italic relative shrink-0 text-[15px] text-center text-nowrap text-white whitespace-pre">Continue Setup</p>
      </div>
    </div>
  );
}

function MyGroupCard() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[1052px]" data-name="MyGroupCard">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start relative size-full">
        <Container10 />
        <Container14 />
        <Button5 />
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="absolute bg-gradient-to-b content-stretch flex flex-col from-[#ffffff] h-[272.7px] items-start left-[4px] pl-[21.6px] pr-[1.6px] py-[21.6px] rounded-[16px] to-[#f9f6f3] top-[84px] w-[1095.2px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[1.6px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <MyGroupCard />
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[356.7px] relative shrink-0 w-full" data-name="Container">
      <Container5 />
      <Card />
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute content-stretch flex flex-col h-[422.3px] items-start left-0 pb-[0.8px] pt-[32.8px] px-[24px] top-[420px] w-[1151.2px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#bedbff] border-[0.8px_0px] border-solid inset-0 pointer-events-none" />
      <Container15 />
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="absolute h-[40px] left-[28px] top-[48px] w-[1095.2px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[40px] left-[547.76px] not-italic text-[32px] text-center text-neutral-950 text-nowrap top-[1.4px] translate-x-[-50%] whitespace-pre">How It Works</p>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Icon">
          <path d={svgPaths.p27a3200} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
          <path d={svgPaths.p2db021c0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
          <path d={svgPaths.p18f42980} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
          <path d={svgPaths.p2ee517c0} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container17() {
  return (
    <div className="basis-0 bg-[#8b5943] grow min-h-px min-w-px relative rounded-[2.68435e+07px] shrink-0 w-[64px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon7 />
      </div>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-[142.74px] not-italic text-[18px] text-center text-neutral-950 text-nowrap top-[0.6px] translate-x-[-50%] whitespace-pre">{`1. Sign Up & Create Profile`}</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[142.5px] not-italic text-[14px] text-center text-neutral-600 text-nowrap top-[-0.4px] translate-x-[-50%] whitespace-pre">Join Caffélino and set up your personal profile</p>
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[52px] relative shrink-0 w-[284.587px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Paragraph4 />
        <Paragraph5 />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[180px] items-center left-[4px] px-0 py-[24px] rounded-[16px] top-0 w-[343.725px]" data-name="Container">
      <Container17 />
      <Container18 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Icon">
          <path d="M10.6667 2.66667V8" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
          <path d="M21.3333 2.66667V8" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
          <path d={svgPaths.p8d31b00} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
          <path d="M4 13.3333H28" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container20() {
  return (
    <div className="basis-0 bg-[#8b5943] grow min-h-px min-w-px relative rounded-[2.68435e+07px] shrink-0 w-[64px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon8 />
      </div>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-[117.18px] not-italic text-[18px] text-center text-neutral-950 text-nowrap top-[0.6px] translate-x-[-50%] whitespace-pre">2. Create Group</p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[117px] not-italic text-[14px] text-center text-neutral-600 text-nowrap top-[-0.4px] translate-x-[-50%] whitespace-pre">Invite friends or family to your meetup</p>
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[52px] relative shrink-0 w-[233.438px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Paragraph6 />
        <Paragraph7 />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[180px] items-center left-[379.73px] px-0 py-[24px] rounded-[16px] top-0 w-[343.738px]" data-name="Container">
      <Container20 />
      <Container21 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Icon">
          <path d={svgPaths.p37a10d80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
          <path d={svgPaths.p29027680} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
          <path d="M16 23.3333V8.66667" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container23() {
  return (
    <div className="basis-0 bg-[#8b5943] grow min-h-px min-w-px relative rounded-[2.68435e+07px] shrink-0 w-[64px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon9 />
      </div>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-[120.32px] not-italic text-[18px] text-center text-neutral-950 text-nowrap top-[0.6px] translate-x-[-50%] whitespace-pre">3. Split Bills Easily</p>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[120px] not-italic text-[14px] text-center text-neutral-600 text-nowrap top-[-0.4px] translate-x-[-50%] whitespace-pre">Order together and split the bill equally</p>
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[52px] relative shrink-0 w-[239.7px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Paragraph8 />
        <Paragraph9 />
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[180px] items-center left-[755.46px] px-0 py-[24px] rounded-[16px] top-0 w-[343.725px]" data-name="Container">
      <Container23 />
      <Container24 />
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute h-[180px] left-[24px] top-[120px] w-[1103.2px]" data-name="Container">
      <Container19 />
      <Container22 />
      <Container25 />
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute h-[364px] left-0 top-[842.3px] w-[1151.2px]" data-name="Container">
      <Paragraph3 />
      <Container26 />
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="absolute h-[40px] left-[28px] top-[64px] w-[1095.2px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[40px] left-[548.08px] not-italic text-[32px] text-center text-neutral-950 text-nowrap top-[1.4px] translate-x-[-50%] whitespace-pre">Perfect for Gatherings</p>
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p1d820380} id="Vector" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p27451300} id="Vector_2" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2981fe00} id="Vector_3" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p161d4800} id="Vector_4" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container28() {
  return (
    <div className="bg-[rgba(139,89,67,0.2)] relative rounded-[2.68435e+07px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon10 />
      </div>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[18px] text-neutral-950 text-nowrap top-[0.6px] whitespace-pre">{`Friends & Family`}</p>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[14px] text-neutral-600 text-nowrap top-[-0.4px] whitespace-pre">Create groups with people you know</p>
    </div>
  );
}

function Container29() {
  return (
    <div className="h-[52px] relative shrink-0 w-[226.475px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Paragraph11 />
        <Paragraph12 />
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex gap-[16px] h-[52px] items-start relative shrink-0 w-full" data-name="Container">
      <Container28 />
      <Container29 />
    </div>
  );
}

function Container31() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[120px] items-start left-[4px] pb-0 pt-[24px] px-[24px] rounded-[16px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] top-0 w-[535.6px]" data-name="Container">
      <Container30 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d="M10 2V4" id="Vector" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M14 2V4" id="Vector_2" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p1f246500} id="Vector_3" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M6 2V4" id="Vector_4" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container32() {
  return (
    <div className="bg-[rgba(139,89,67,0.2)] relative rounded-[2.68435e+07px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon11 />
      </div>
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[18px] text-neutral-950 text-nowrap top-[0.6px] whitespace-pre">Vote on Café Together</p>
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[14px] text-neutral-600 top-[-0.4px] w-[403px]">Choose from up to 3 cafés and let everyone vote on their favorite spot.</p>
    </div>
  );
}

function Container33() {
  return (
    <div className="basis-0 grow h-[72px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Paragraph13 />
        <Paragraph14 />
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex gap-[16px] h-[72px] items-start relative shrink-0 w-full" data-name="Container">
      <Container32 />
      <Container33 />
    </div>
  );
}

function Container35() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[120px] items-start left-[563.6px] pb-0 pt-[24px] px-[24px] rounded-[16px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] top-0 w-[535.6px]" data-name="Container">
      <Container34 />
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p104a6f80} id="Vector" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p3836560} id="Vector_2" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M12 17.5V6.5" id="Vector_3" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container36() {
  return (
    <div className="bg-[rgba(139,89,67,0.2)] relative rounded-[2.68435e+07px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon12 />
      </div>
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[18px] text-neutral-950 text-nowrap top-[0.6px] whitespace-pre">Equal Bill Splitting</p>
    </div>
  );
}

function Paragraph16() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[14px] text-neutral-600 text-nowrap top-[-0.4px] whitespace-pre">Bills are automatically split equally among all group members.</p>
    </div>
  );
}

function Container37() {
  return (
    <div className="h-[52px] relative shrink-0 w-[382.85px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Paragraph15 />
        <Paragraph16 />
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex gap-[16px] h-[52px] items-start relative shrink-0 w-full" data-name="Container">
      <Container36 />
      <Container37 />
    </div>
  );
}

function Container39() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[120px] items-start left-[4px] pb-0 pt-[24px] px-[24px] rounded-[16px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] top-[144px] w-[535.6px]" data-name="Container">
      <Container38 />
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g clipPath="url(#clip0_434_609)" id="Icon">
          <path d={svgPaths.p3eebfc00} id="Vector" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M20 2V6" id="Vector_2" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M22 4H18" id="Vector_3" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p352890c0} id="Vector_4" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_434_609">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container40() {
  return (
    <div className="bg-[rgba(139,89,67,0.2)] relative rounded-[2.68435e+07px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon13 />
      </div>
    </div>
  );
}

function Paragraph17() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[18px] text-neutral-950 text-nowrap top-[0.6px] whitespace-pre">{`Group Chat & Menu`}</p>
    </div>
  );
}

function Paragraph18() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[14px] text-neutral-600 top-[-0.4px] w-[395px]">Chat with your group and share food orders with images in real-time.</p>
    </div>
  );
}

function Container41() {
  return (
    <div className="basis-0 grow h-[72px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Paragraph17 />
        <Paragraph18 />
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex gap-[16px] h-[72px] items-start relative shrink-0 w-full" data-name="Container">
      <Container40 />
      <Container41 />
    </div>
  );
}

function Container43() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[120px] items-start left-[563.6px] pb-0 pt-[24px] px-[24px] rounded-[16px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] top-[144px] w-[535.6px]" data-name="Container">
      <Container42 />
    </div>
  );
}

function Container44() {
  return (
    <div className="absolute h-[264px] left-[24px] top-[136px] w-[1103.2px]" data-name="Container">
      <Container31 />
      <Container35 />
      <Container39 />
      <Container43 />
    </div>
  );
}

function Container45() {
  return (
    <div className="absolute h-[464px] left-0 top-[1206.3px] w-[1151.2px]" data-name="Container">
      <Paragraph10 />
      <Container44 />
    </div>
  );
}

function Container46() {
  return <div className="absolute border-[0.8px_0px_0px] border-neutral-200 border-solid h-[64.8px] left-0 top-[1670.3px] w-[1151.2px]" data-name="Container" />;
}

function Paragraph19() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[1071.2px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Advent_Pro:Regular',sans-serif] font-normal leading-[60px] left-[535.85px] text-[#4a2c1a] text-[48px] text-center text-nowrap top-[-1.2px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>{`Plan Meetups with Friends & Family`}</p>
      </div>
    </div>
  );
}

function Paragraph20() {
  return (
    <div className="h-[28px] relative shrink-0 w-[1071.2px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start px-[8px] py-0 relative size-full">
        <p className="basis-0 font-['Archivo_Narrow:Regular',sans-serif] font-normal grow leading-[28px] min-h-px min-w-px relative shrink-0 text-[#4a2c1a] text-[20px] text-center">Create Groups. Split Bills. Enjoy Together.</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[#030213] h-[48px] relative rounded-[8px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] shrink-0 w-[163.225px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[22.5px] left-[82px] not-italic text-[15px] text-center text-nowrap text-white top-[13.15px] translate-x-[-50%] whitespace-pre">Create Meetup</p>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-[#030213] h-[48px] relative rounded-[8px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0 w-[162.387px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[22.5px] left-[81.5px] not-italic text-[15px] text-center text-nowrap text-white top-[13.15px] translate-x-[-50%] whitespace-pre">Join with Code</p>
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="h-[48px] relative shrink-0 w-[1071.2px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center justify-center pl-0 pr-[0.013px] py-0 relative size-full">
        <Button6 />
        <Button7 />
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="h-[192px] relative shrink-0 w-[1103.2px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-center relative size-full">
        <Paragraph19 />
        <Paragraph20 />
        <Container47 />
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="absolute bg-gradient-to-b content-stretch flex flex-col from-[rgba(217,191,157,0.5)] h-[420px] items-start justify-center left-0 pl-[24px] pr-0 py-0 to-[rgba(255,255,255,0.3)] top-0 w-[1151.2px]" data-name="Container">
      <Container48 />
    </div>
  );
}

function Container50() {
  return (
    <div className="absolute h-[1735.1px] left-0 top-[0.8px] w-[1151.2px]" data-name="Container">
      <Container16 />
      <Container27 />
      <Container45 />
      <Container46 />
      <Container49 />
    </div>
  );
}

function HomePage() {
  return (
    <div className="bg-white h-[1987.9px] overflow-clip relative shrink-0 w-full" data-name="HomePage">
      <Footer />
      <Container50 />
    </div>
  );
}

function AppContent() {
  return (
    <div className="absolute bg-slate-50 content-stretch flex flex-col h-[2043.9px] items-start left-0 pb-0 pt-[56px] px-0 top-[-238.4px] w-[1151.2px]" data-name="AppContent">
      <HomePage />
    </div>
  );
}

function ImageLogo() {
  return (
    <div className="absolute h-[40px] left-[16px] top-[7.6px] w-[133.325px]" data-name="Image (Logo)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgImageLogo} />
    </div>
  );
}

function Paragraph21() {
  return (
    <div className="absolute h-[27px] left-0 top-[4.5px] w-[63.75px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[27px] left-0 not-italic text-[18px] text-black text-nowrap top-[0.2px] tracking-[0.45px] whitespace-pre">xxxsds</p>
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p31962400} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1f3d9f80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 rounded-[2.68435e+07px] size-[36px] top-0" data-name="Button">
      <Icon14 />
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[31.988px] relative shrink-0 w-[32.963px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="basis-0 font-['Arial:Regular',sans-serif] grow leading-[32px] min-h-px min-w-px not-italic relative shrink-0 text-[#2c1810] text-[24px] text-center">👨‍💻</p>
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute bg-gradient-to-b from-[#e8d5c4] left-[48px] rounded-[2.68435e+07px] size-[36px] to-[#d9bf9d] top-0" data-name="Button">
      <div className="content-stretch flex items-center justify-center overflow-clip pl-[1.613px] pr-[1.6px] py-[1.6px] relative rounded-[inherit] size-full">
        <Text5 />
      </div>
      <div aria-hidden="true" className="absolute border-[1.6px] border-[rgba(255,255,255,0.6)] border-solid inset-0 pointer-events-none rounded-[2.68435e+07px]" />
    </div>
  );
}

function Container51() {
  return (
    <div className="absolute h-[36px] left-[75.75px] top-0 w-[84px]" data-name="Container">
      <Button8 />
      <Button9 />
    </div>
  );
}

function Container52() {
  return (
    <div className="absolute h-[36px] left-[990.65px] top-[9.6px] w-[159.75px]" data-name="Container">
      <Paragraph21 />
      <Container51 />
    </div>
  );
}

function AppContent1() {
  return (
    <div className="absolute bg-[#be9d80] border-[0px_0px_0.8px] border-black border-solid h-[55.2px] left-0 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-0 w-[1166.4px]" data-name="AppContent">
      <ImageLogo />
      <Container52 />
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