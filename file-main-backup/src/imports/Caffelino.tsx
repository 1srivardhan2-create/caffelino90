import svgPaths from "./svg-2zyi9tit08";
const imgImageLogo = "/logo.png";
const imgProfile2 = "/profile2.png";
function Heading() {
  return (
    <div className="absolute h-[27px] left-0 top-0 w-[303.425px]" data-name="Heading 3">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[27px] left-0 not-italic text-[18px] text-nowrap text-white top-[-2.2px] whitespace-pre">Caffélino</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[21px] left-0 top-[39px] w-[303.425px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#cad5e2] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">Connect with real people over real conversations.</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[9.2px] size-[16px] top-[9.2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_239_242)" id="Icon">
          <path d={svgPaths.p22916300} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1485310} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M11.6667 4.33335H11.6733" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_239_242">
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
    <div className="absolute h-[156px] left-[107px] top-0 w-[303.425px]" data-name="Container">
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

function Link1() {
  return (
    <div className="absolute content-stretch flex h-[18.4px] items-start left-0 top-[3.2px] w-[37.525px]" data-name="Link">
      <p className="font-['Arial:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#cad5e2] text-[14px] text-nowrap whitespace-pre">Home</p>
    </div>
  );
}

function ListItem() {
  return (
    <div className="absolute h-[24px] left-0 top-0 w-[303.425px]" data-name="List Item">
      <Link1 />
    </div>
  );
}

function Link2() {
  return (
    <div className="absolute content-stretch flex h-[18.4px] items-start left-0 top-[3.2px] w-[52.713px]" data-name="Link">
      <p className="font-['Arial:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#cad5e2] text-[14px] text-nowrap whitespace-pre">How It Works</p>
    </div>
  );
}

function ListItem1() {
  return (
    <div className="absolute h-[24px] left-0 top-[32px] w-[303.425px]" data-name="List Item">
      <Link2 />
    </div>
  );
}

function Button() {
  return (
    <div className="absolute h-[21px] left-0 top-[2.4px] w-[91.925px]" data-name="Button">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#cad5e2] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">Partner with us</p>
    </div>
  );
}

function ListItem2() {
  return (
    <div className="absolute h-[24px] left-0 top-[64px] w-[303.425px]" data-name="List Item">
      <Button />
    </div>
  );
}

function Link3() {
  return (
    <div className="absolute content-stretch flex h-[18.4px] items-start left-0 top-[3.2px] w-[67.275px]" data-name="Link">
      <p className="font-['Arial:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#cad5e2] text-[14px] text-nowrap whitespace-pre">Contact Us</p>
    </div>
  );
}

function ListItem3() {
  return (
    <div className="absolute h-[24px] left-0 top-[96px] w-[303.425px]" data-name="List Item">
      <Link3 />
    </div>
  );
}

function List() {
  return (
    <div className="h-[120px] relative shrink-0 w-full" data-name="List">
      <ListItem />
      <ListItem1 />
      <ListItem2 />
      <ListItem3 />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[156px] items-start left-[526.43px] top-0 w-[303.425px]" data-name="Container">
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

function Button1() {
  return (
    <div className="absolute h-[21px] left-0 top-[2.4px] w-[57.525px]" data-name="Button">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#cad5e2] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">About Us</p>
    </div>
  );
}

function ListItem4() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button1 />
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute h-[21px] left-0 top-[2.4px] w-[82.9px]" data-name="Button">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#cad5e2] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">How It Works</p>
    </div>
  );
}

function ListItem5() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button2 />
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute h-[21px] left-0 top-[2.4px] w-[106.075px]" data-name="Button">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#cad5e2] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">Safety Guidelines</p>
    </div>
  );
}

function ListItem6() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button3 />
    </div>
  );
}

function List1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[88px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem4 />
      <ListItem5 />
      <ListItem6 />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[156px] items-start left-[823.85px] top-0 w-[303.425px]" data-name="Container">
      <Heading2 />
      <List1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute h-[220px] left-[16px] top-[40px] w-[974.275px]" data-name="Container">
      <Container />
      <Container1 />
      <Container2 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[21px] relative shrink-0 w-[240.512px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[240.512px]">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#314158] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">Join Caffélino to create and join groups</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#be9d80] h-[36px] relative rounded-[8px] shrink-0 w-[146.975px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[36px] items-center justify-center px-[24px] py-[8px] relative w-[146.975px]">
        <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre">Login / Sign Up</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-white relative rounded-[2.68435e+07px] shrink-0 size-[36px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[36px]" />
    </div>
  );
}

function Container5() {
  return (
    <div className="relative rounded-[2.68435e+07px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center overflow-clip relative rounded-[inherit] size-[40px]">
        <Container4 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[40px] relative shrink-0 w-[198.975px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[12px] h-[40px] items-center relative w-[198.975px]">
        <Button4 />
        <Container5 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex h-[40px] items-center justify-between relative w-full">
          <Paragraph1 />
          <Container6 />
        </div>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col h-[72.8px] items-start left-0 pb-0 pt-[16.8px] px-[16px] top-[284px] w-[1006.27px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.8px_0px_0px] border-slate-200 border-solid inset-0 pointer-events-none" />
      <Container7 />
    </div>
  );
}

function Footer() {
  return (
    <div className="absolute bg-[#1a2332] h-[420px] left-0 top-[1490px] w-[1151px]" data-name="Footer">
      <Container3 />
      <Container8 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute h-[40px] left-[28px] top-[48px] w-[1095.2px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[40px] left-[547.76px] not-italic text-[32px] text-center text-neutral-950 text-nowrap top-[1.4px] translate-x-[-50%] whitespace-pre">How It Works</p>
    </div>
  );
}

function Icon1() {
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

function Container9() {
  return (
    <div className="basis-0 bg-[#8b5943] grow min-h-px min-w-px relative rounded-[2.68435e+07px] shrink-0 w-[64px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-full items-center justify-center relative w-[64px]">
        <Icon1 />
      </div>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-[142.74px] not-italic text-[18px] text-center text-neutral-950 text-nowrap top-[0.6px] translate-x-[-50%] whitespace-pre">{`1. Sign Up & Create Profile`}</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[142.5px] not-italic text-[14px] text-center text-neutral-600 text-nowrap top-[-0.4px] translate-x-[-50%] whitespace-pre">Join Caffélino and set up your personal profile</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[52px] relative shrink-0 w-[284.587px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[8px] h-[52px] items-start relative w-[284.587px]">
        <Paragraph3 />
        <Paragraph4 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[16px] h-[180px] items-center left-[4px] px-0 py-[24px] rounded-[16px] top-0 w-[343.725px]" data-name="Container">
      <Container9 />
      <Container10 />
    </div>
  );
}

function Icon2() {
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

function Container12() {
  return (
    <div className="basis-0 bg-[#8b5943] grow min-h-px min-w-px relative rounded-[2.68435e+07px] shrink-0 w-[64px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-full items-center justify-center relative w-[64px]">
        <Icon2 />
      </div>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-[117.16px] not-italic text-[18px] text-center text-neutral-950 text-nowrap top-[0.6px] translate-x-[-50%] whitespace-pre">2. Create Private Group</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[117px] not-italic text-[14px] text-center text-neutral-600 text-nowrap top-[-0.4px] translate-x-[-50%] whitespace-pre">Invite friends or family to your meetup</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[52px] relative shrink-0 w-[233.438px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[8px] h-[52px] items-start relative w-[233.438px]">
        <Paragraph5 />
        <Paragraph6 />
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[16px] h-[180px] items-center left-[379.73px] px-0 py-[24px] rounded-[16px] top-0 w-[343.738px]" data-name="Container">
      <Container12 />
      <Container13 />
    </div>
  );
}

function Icon3() {
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

function Container15() {
  return (
    <div className="basis-0 bg-[#8b5943] grow min-h-px min-w-px relative rounded-[2.68435e+07px] shrink-0 w-[64px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-full items-center justify-center relative w-[64px]">
        <Icon3 />
      </div>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-[120.32px] not-italic text-[18px] text-center text-neutral-950 text-nowrap top-[0.6px] translate-x-[-50%] whitespace-pre">3. Split Bills Easily</p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[120px] not-italic text-[14px] text-center text-neutral-600 text-nowrap top-[-0.4px] translate-x-[-50%] whitespace-pre">Order together and split the bill equally</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[52px] relative shrink-0 w-[239.7px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[8px] h-[52px] items-start relative w-[239.7px]">
        <Paragraph7 />
        <Paragraph8 />
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[16px] h-[180px] items-center left-[755.46px] px-0 py-[24px] rounded-[16px] top-0 w-[343.725px]" data-name="Container">
      <Container15 />
      <Container16 />
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute h-[180px] left-[24px] top-[120px] w-[1103.2px]" data-name="Container">
      <Container11 />
      <Container14 />
      <Container17 />
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute h-[364px] left-0 top-[420px] w-[1151.2px]" data-name="Container">
      <Paragraph2 />
      <Container18 />
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="absolute h-[40px] left-[28px] top-[64px] w-[1095.2px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[40px] left-[547.84px] not-italic text-[32px] text-center text-neutral-950 text-nowrap top-[1.4px] translate-x-[-50%] whitespace-pre">Perfect for Private Gatherings</p>
    </div>
  );
}

function Icon4() {
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

function Container20() {
  return (
    <div className="bg-[rgba(139,89,67,0.2)] relative rounded-[2.68435e+07px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[48px]">
        <Icon4 />
      </div>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[18px] text-neutral-950 text-nowrap top-[0.6px] whitespace-pre">{`Friends & Family`}</p>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[14px] text-neutral-600 top-[-0.4px] w-[390px]">Create private groups with people you know</p>
    </div>
  );
}

function Container21() {
  return (
    <div className="basis-0 grow h-[72px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[8px] h-[72px] items-start relative w-full">
        <Paragraph10 />
        <Paragraph11 />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex gap-[16px] h-[72px] items-start relative shrink-0 w-full" data-name="Container">
      <Container20 />
      <Container21 />
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col h-[120px] items-start left-[4px] pb-0 pt-[24px] px-[24px] rounded-[16px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] top-0 w-[535.6px]" data-name="Container">
      <Container22 />
    </div>
  );
}

function Icon5() {
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

function Container24() {
  return (
    <div className="bg-[rgba(139,89,67,0.2)] relative rounded-[2.68435e+07px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[48px]">
        <Icon5 />
      </div>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[18px] text-neutral-950 text-nowrap top-[0.6px] whitespace-pre">Vote on Café Together</p>
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[14px] text-neutral-600 top-[-0.4px] w-[403px]">Choose from up to 3 cafés and let everyone vote on their favorite spot.</p>
    </div>
  );
}

function Container25() {
  return (
    <div className="basis-0 grow h-[72px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[8px] h-[72px] items-start relative w-full">
        <Paragraph12 />
        <Paragraph13 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex gap-[16px] h-[72px] items-start relative shrink-0 w-full" data-name="Container">
      <Container24 />
      <Container25 />
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col h-[120px] items-start left-[563.6px] pb-0 pt-[24px] px-[24px] rounded-[16px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] top-0 w-[535.6px]" data-name="Container">
      <Container26 />
    </div>
  );
}

function Icon6() {
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

function Container28() {
  return (
    <div className="bg-[rgba(139,89,67,0.2)] relative rounded-[2.68435e+07px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[48px]">
        <Icon6 />
      </div>
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[18px] text-neutral-950 text-nowrap top-[0.6px] whitespace-pre">Equal Bill Splitting</p>
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[14px] text-neutral-600 text-nowrap top-[-0.4px] whitespace-pre">Bills are automatically split equally among all group members.</p>
    </div>
  );
}

function Container29() {
  return (
    <div className="h-[52px] relative shrink-0 w-[382.85px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[8px] h-[52px] items-start relative w-[382.85px]">
        <Paragraph14 />
        <Paragraph15 />
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
    <div className="absolute bg-white box-border content-stretch flex flex-col h-[120px] items-start left-[4px] pb-0 pt-[24px] px-[24px] rounded-[16px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] top-[144px] w-[535.6px]" data-name="Container">
      <Container30 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g clipPath="url(#clip0_239_236)" id="Icon">
          <path d={svgPaths.p3eebfc00} id="Vector" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M20 2V6" id="Vector_2" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M22 4H18" id="Vector_3" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p352890c0} id="Vector_4" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_239_236">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container32() {
  return (
    <div className="bg-[rgba(139,89,67,0.2)] relative rounded-[2.68435e+07px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[48px]">
        <Icon7 />
      </div>
    </div>
  );
}

function Paragraph16() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[18px] text-neutral-950 text-nowrap top-[0.6px] whitespace-pre">{`Group Chat & Menu`}</p>
    </div>
  );
}

function Paragraph17() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[14px] text-neutral-600 top-[-0.4px] w-[395px]">Chat with your group and share food orders with images in real-time.</p>
    </div>
  );
}

function Container33() {
  return (
    <div className="basis-0 grow h-[72px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[8px] h-[72px] items-start relative w-full">
        <Paragraph16 />
        <Paragraph17 />
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
    <div className="absolute bg-white box-border content-stretch flex flex-col h-[120px] items-start left-[563.6px] pb-0 pt-[24px] px-[24px] rounded-[16px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] top-[144px] w-[535.6px]" data-name="Container">
      <Container34 />
    </div>
  );
}

function Container36() {
  return (
    <div className="absolute h-[264px] left-[24px] top-[136px] w-[1103.2px]" data-name="Container">
      <Container23 />
      <Container27 />
      <Container31 />
      <Container35 />
    </div>
  );
}

function Container37() {
  return (
    <div className="absolute h-[464px] left-0 top-[784px] w-[1151.2px]" data-name="Container">
      <Paragraph9 />
      <Container36 />
    </div>
  );
}

function Paragraph18() {
  return (
    <div className="absolute h-[40px] left-[376.31px] top-[48px] w-[398.563px]" data-name="Paragraph">
      <p className="absolute font-['Advent_Pro:Regular',sans-serif] font-normal leading-[40px] left-[199.5px] text-[32px] text-center text-neutral-950 text-nowrap top-[-0.2px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Ready to Plan Your Next Meetup?
      </p>
    </div>
  );
}

function Paragraph19() {
  return (
    <div className="absolute h-[40px] left-[239.6px] top-[112px] w-[672px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[336.07px] not-italic text-[16px] text-center text-neutral-600 top-[-0.2px] translate-x-[-50%] w-[659px]">{`Whether it's a casual coffee catch-up or a family dinner, Caffélino makes planning and paying simple.`}</p>
    </div>
  );
}

function Paragraph20() {
  return (
    <div className="absolute h-[20px] left-0 top-[14px] w-[55.4px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[28px] not-italic text-[15px] text-center text-nowrap text-white top-[0.6px] translate-x-[-50%] whitespace-pre">{`Let's Go`}</p>
    </div>
  );
}

function Container38() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Container">
      <Paragraph20 />
    </div>
  );
}

function Container39() {
  return (
    <div className="absolute bg-[#030213] box-border content-stretch flex flex-col h-[48px] items-start left-[499.9px] px-[48px] py-0 rounded-[8px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] top-[192px] w-[151.4px]" data-name="Container">
      <Container38 />
    </div>
  );
}

function Container40() {
  return (
    <div className="absolute h-[304px] left-0 top-[1248px] w-[1151.2px]" data-name="Container">
      <Paragraph18 />
      <Paragraph19 />
      <Container39 />
    </div>
  );
}

function Paragraph21() {
  return (
    <div className="h-[60px] relative shrink-0 w-[1071.2px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[60px] relative w-[1071.2px]">
        <p className="absolute font-['Advent_Pro:Regular',sans-serif] font-normal leading-[60px] left-[535.85px] text-[#4a2c1a] text-[48px] text-center text-nowrap top-[-1.2px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>{`Plan Meetups with Friends & Family`}</p>
      </div>
    </div>
  );
}

function Paragraph22() {
  return (
    <div className="h-[28px] relative shrink-0 w-[1071.2px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[28px] items-start px-[8px] py-0 relative w-[1071.2px]">
        <p className="basis-0 font-['Archivo_Narrow:Regular',sans-serif] font-normal grow leading-[28px] min-h-px min-w-px relative shrink-0 text-[#4a2c1a] text-[20px] text-center">Create Private Groups. Split Bills. Enjoy Together.</p>
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="absolute left-0 size-[20px] top-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p2dd2d200} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Paragraph23() {
  return (
    <div className="absolute h-[20px] left-[28px] top-[14px] w-[150.075px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[15px] text-nowrap text-white top-[0.6px] whitespace-pre">Create Private Meetup</p>
    </div>
  );
}

function Container41() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Container">
      <Icon8 />
      <Paragraph23 />
    </div>
  );
}

function Container42() {
  return (
    <div className="absolute bg-[#030213] box-border content-stretch flex flex-col h-[48px] items-start left-[303.02px] px-[32px] py-0 rounded-[8px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] top-0 w-[242.075px]" data-name="Container">
      <Container41 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="absolute left-0 size-[20px] top-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p2334e780} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Paragraph24() {
  return (
    <div className="absolute h-[20px] left-[28px] top-[14px] w-[115.075px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[15px] text-nowrap text-white top-[0.6px] whitespace-pre">Join via Invitation</p>
    </div>
  );
}

function Container43() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Container">
      <Icon9 />
      <Paragraph24 />
    </div>
  );
}

function Container44() {
  return (
    <div className="absolute bg-[#030213] box-border content-stretch flex flex-col h-[48px] items-start left-[561.1px] px-[32px] py-0 rounded-[8px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-0 w-[207.075px]" data-name="Container">
      <Container43 />
    </div>
  );
}

function Container45() {
  return (
    <div className="h-[48px] relative shrink-0 w-[1071.2px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[48px] relative w-[1071.2px]">
        <Container42 />
        <Container44 />
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="h-[192px] relative shrink-0 w-[1103.2px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[24px] h-[192px] items-center relative w-[1103.2px]">
        <Paragraph21 />
        <Paragraph22 />
        <Container45 />
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="absolute bg-gradient-to-b box-border content-stretch flex flex-col from-[rgba(217,191,157,0.5)] h-[420px] items-start justify-center left-0 pl-[24px] pr-0 py-0 to-[rgba(255,255,255,0.3)] top-0 w-[1151.2px]" data-name="Container">
      <Container46 />
    </div>
  );
}

function Container48() {
  return (
    <div className="absolute h-[1552px] left-0 top-[0.8px] w-[1151.2px]" data-name="Container">
      <Container19 />
      <Container37 />
      <Container40 />
      <Container47 />
    </div>
  );
}

function HomePage() {
  return (
    <div className="bg-white h-[1909.6px] relative shrink-0 w-full" data-name="HomePage">
      <Footer />
      <Container48 />
    </div>
  );
}

function AppContent() {
  return (
    <div className="absolute bg-slate-50 box-border content-stretch flex flex-col h-[1965.6px] items-start left-0 pb-0 pt-[56px] px-0 top-0 w-[1151.2px]" data-name="AppContent">
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

function TextInput() {
  return (
    <div className="absolute bg-white box-border content-stretch flex h-[36px] items-center left-0 overflow-clip pl-[40px] pr-[16px] py-[8px] rounded-[2.68435e+07px] top-0 w-[448px]" data-name="Text Input">
      <p className="font-['Arial:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(44,24,16,0.5)] text-nowrap whitespace-pre">Search city, cafe or topic</p>
    </div>
  );
}

function Icon10() {
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

function Container49() {
  return (
    <div className="absolute h-[36px] left-[352.52px] top-[9.6px] w-[448px]" data-name="Container">
      <TextInput />
      <Icon10 />
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute bg-white box-border content-stretch flex gap-[8px] h-[36px] items-center justify-center left-[48px] px-[24px] py-[8px] rounded-[10px] top-0 w-[83.475px]" data-name="Button">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#0f172b] text-[14px] text-center text-nowrap whitespace-pre">Login</p>
    </div>
  );
}

function Icon11() {
  return (
    <div className="absolute left-[8px] size-[20px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p3b7be120} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1f3d9f80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="absolute bg-[#fb2c36] content-stretch flex items-center justify-center left-[20px] rounded-[2.68435e+07px] size-[20px] top-[-4px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-center text-nowrap text-white whitespace-pre">3</p>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute left-0 rounded-[2.68435e+07px] size-[36px] top-0" data-name="Button">
      <Icon11 />
      <Text />
    </div>
  );
}

function Container50() {
  return (
    <div className="absolute h-[36px] left-[1003.73px] top-[9.6px] w-[131.475px]" data-name="Container">
      <Button5 />
      <Button6 />
    </div>
  );
}

function AppContent1() {
  return (
    <div className="absolute bg-[#be9d80] border-[0px_0px_0.8px] border-black border-solid h-[55.2px] left-0 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-[1236px] w-[1151.2px]" data-name="AppContent">
      <ImageLogo />
      <Container49 />
      <Container50 />
    </div>
  );
}

function Paragraph25() {
  return (
    <div className="h-[20px] relative shrink-0 w-[892.225px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[892.225px]">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#45556c] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">Join Caffélino to create and join groups</p>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-[saddlebrown] h-[36px] relative rounded-[10px] shrink-0 w-[130.975px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[36px] items-center justify-center px-[16px] py-[8px] relative w-[130.975px]">
        <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre">Login / Sign Up</p>
      </div>
    </div>
  );
}

function AppContent2() {
  return (
    <div className="absolute bg-white box-border content-stretch flex h-[72px] items-center justify-between left-0 pb-0 pt-[0.8px] px-[16px] top-[1893.6px] w-[1151.2px]" data-name="AppContent">
      <div aria-hidden="true" className="absolute border-[0.8px_0px_0px] border-black border-solid inset-0 pointer-events-none shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" />
      <Paragraph25 />
      <Button7 />
      <div className="relative shrink-0 size-[63px]" data-name="profile 2">
        <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid box-border inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgProfile2} />
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[63px]" />
      </div>
    </div>
  );
}

export default function Caffelino() {
  return (
    <div className="bg-[#fffbf5] relative size-full" data-name="caffelino">
      <AppContent />
      <AppContent1 />
      <AppContent2 />
    </div>
  );
}