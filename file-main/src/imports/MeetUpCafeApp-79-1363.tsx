import svgPaths from "./svg-6hmn6c96uy";

function Heading() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[48px] left-[448.73px] not-italic text-[40px] text-center text-neutral-950 text-nowrap top-[-4.2px] translate-x-[-50%] whitespace-pre">Partner with Caffélino</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[26px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[26px] left-[448.21px] not-italic text-[#314158] text-[18px] text-center text-nowrap top-[-1.2px] translate-x-[-50%] whitespace-pre">Join our network of cafés and connect with amazing communities</p>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[90px] items-start left-0 top-[53px] w-[896px]" data-name="Container">
      <Heading />
      <Paragraph />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="Icon">
          <path d={svgPaths.p7b52180} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
          <path d="M25 20H5" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
          <path d={svgPaths.p1ff2680} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[142.4px] rounded-[2.68435e+07px] size-[80px] top-0" data-name="Container">
      <Icon />
    </div>
  );
}

function Heading1() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-start left-0 top-[96px] w-[364.8px]" data-name="Heading 2">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[32px] min-h-px min-w-px not-italic relative shrink-0 text-[24px] text-center text-neutral-950">Already Registered?</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[21px] left-0 top-[136px] w-[364.8px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[21px] left-[182.15px] not-italic text-[#45556c] text-[14px] text-center text-nowrap top-[-1.2px] translate-x-[-50%] whitespace-pre">Sign in to access your café dashboard</p>
    </div>
  );
}

function PartnerLoginChoice() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[364.8px]" data-name="PartnerLoginChoice">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-full relative w-[364.8px]">
        <Container1 />
        <Heading1 />
        <Paragraph1 />
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[25%_15%_25%_15.06%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 8">
          <path clipRule="evenodd" d={svgPaths.p153f0d00} fill="var(--fill-0, #4F39F6)" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute bg-indigo-100 box-border content-stretch flex flex-col items-start left-0 pb-0 pt-[4px] px-[4px] rounded-[2.68435e+07px] size-[24px] top-[2px]" data-name="Container">
      <Icon1 />
    </div>
  );
}

function Text() {
  return (
    <div className="absolute h-[21px] left-[36px] top-0 w-[169.562px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[21px] left-0 not-italic text-[#314158] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">{`Manage bookings & orders`}</p>
    </div>
  );
}

function ListItem() {
  return (
    <div className="h-[26px] relative shrink-0 w-full" data-name="List Item">
      <Container2 />
      <Text />
    </div>
  );
}

function Icon2() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[25%_15%_25%_15.06%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 8">
          <path clipRule="evenodd" d={svgPaths.p153f0d00} fill="var(--fill-0, #4F39F6)" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute bg-indigo-100 box-border content-stretch flex flex-col items-start left-0 pb-0 pt-[4px] px-[4px] rounded-[2.68435e+07px] size-[24px] top-[2px]" data-name="Container">
      <Icon2 />
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute h-[21px] left-[36px] top-0 w-[163.75px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[21px] left-0 not-italic text-[#314158] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">{`Track revenue & payments`}</p>
    </div>
  );
}

function ListItem1() {
  return (
    <div className="h-[26px] relative shrink-0 w-full" data-name="List Item">
      <Container3 />
      <Text1 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[25%_15%_25%_15.06%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 8">
          <path clipRule="evenodd" d={svgPaths.p153f0d00} fill="var(--fill-0, #4F39F6)" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute bg-indigo-100 box-border content-stretch flex flex-col items-start left-0 pb-0 pt-[4px] px-[4px] rounded-[2.68435e+07px] size-[24px] top-[2px]" data-name="Container">
      <Icon3 />
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute h-[21px] left-[36px] top-0 w-[155.913px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[21px] left-0 not-italic text-[#314158] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">Engage with loyal groups</p>
    </div>
  );
}

function ListItem2() {
  return (
    <div className="h-[26px] relative shrink-0 w-full" data-name="List Item">
      <Container4 />
      <Text2 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[25%_15%_25%_15.06%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 8">
          <path clipRule="evenodd" d={svgPaths.p153f0d00} fill="var(--fill-0, #4F39F6)" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute bg-indigo-100 box-border content-stretch flex flex-col items-start left-0 pb-0 pt-[4px] px-[4px] rounded-[2.68435e+07px] size-[24px] top-[2px]" data-name="Container">
      <Icon4 />
    </div>
  );
}

function Text3() {
  return (
    <div className="absolute h-[21px] left-[36px] top-0 w-[143.012px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[21px] left-0 not-italic text-[#314158] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">{`Update menu & profile`}</p>
    </div>
  );
}

function ListItem3() {
  return (
    <div className="h-[26px] relative shrink-0 w-full" data-name="List Item">
      <Container5 />
      <Text3 />
    </div>
  );
}

function PartnerLoginChoice1() {
  return (
    <div className="h-[140px] relative shrink-0 w-[364.8px]" data-name="PartnerLoginChoice">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[12px] h-[140px] items-start relative w-[364.8px]">
        <ListItem />
        <ListItem1 />
        <ListItem2 />
        <ListItem3 />
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="absolute left-[142.4px] size-[20px] top-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p75fc300} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M12.5 10H2.5" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pca41100} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-gradient-to-r from-[#8b5943] h-[48px] relative rounded-[10px] shrink-0 to-[#8b5943] via-[#d9bf9d] via-[51.923%] w-[364.8px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[48px] relative w-[364.8px]">
        <Icon5 />
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[178.4px] not-italic text-[14px] text-black text-nowrap top-[12.8px] whitespace-pre">Sign In</p>
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="[grid-area:1_/_1] bg-white h-[516.2px] relative rounded-[16px] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border-[1.6px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[48px] h-[516.2px] items-start pl-[33.6px] pr-[1.6px] py-[33.6px] relative w-full">
          <PartnerLoginChoice />
          <PartnerLoginChoice1 />
          <Button />
        </div>
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="Icon">
          <path d={svgPaths.p1a96b600} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
          <path d={svgPaths.p1517b200} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
          <path d="M31.6667 13.3333V23.3333" id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
          <path d="M36.6667 18.3333H26.6667" id="Vector_4" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[142.4px] rounded-[2.68435e+07px] size-[80px] top-0" data-name="Container">
      <Icon6 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-start left-0 top-[96px] w-[364.8px]" data-name="Heading 2">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[32px] min-h-px min-w-px not-italic relative shrink-0 text-[24px] text-center text-neutral-950">Register Now</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute h-[21px] left-0 top-[136px] w-[364.8px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[21px] left-[181.97px] not-italic text-[#45556c] text-[14px] text-center text-nowrap top-[-1.2px] translate-x-[-50%] whitespace-pre">New to Caffélino? Get started today</p>
    </div>
  );
}

function PartnerLoginChoice2() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[364.8px]" data-name="PartnerLoginChoice">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-full relative w-[364.8px]">
        <Container6 />
        <Heading3 />
        <Paragraph2 />
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[25%_15%_25%_15.06%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 8">
          <path clipRule="evenodd" d={svgPaths.p153f0d00} fill="var(--fill-0, #00A63E)" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute bg-green-100 box-border content-stretch flex flex-col items-start left-0 pb-0 pt-[4px] px-[4px] rounded-[2.68435e+07px] size-[24px] top-[2px]" data-name="Container">
      <Icon7 />
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute h-[21px] left-[36px] top-0 w-[166.95px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[21px] left-0 not-italic text-[#314158] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">{`Free to join & list your café`}</p>
    </div>
  );
}

function ListItem4() {
  return (
    <div className="h-[26px] relative shrink-0 w-full" data-name="List Item">
      <Container7 />
      <Text4 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[25%_15%_25%_15.06%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 8">
          <path clipRule="evenodd" d={svgPaths.p153f0d00} fill="var(--fill-0, #00A63E)" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute bg-green-100 box-border content-stretch flex flex-col items-start left-0 pb-0 pt-[4px] px-[4px] rounded-[2.68435e+07px] size-[24px] top-[2px]" data-name="Container">
      <Icon8 />
    </div>
  );
}

function Text5() {
  return (
    <div className="absolute h-[21px] left-[36px] top-0 w-[133.3px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[21px] left-0 not-italic text-[#314158] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">Reach new customers</p>
    </div>
  );
}

function ListItem5() {
  return (
    <div className="h-[26px] relative shrink-0 w-full" data-name="List Item">
      <Container8 />
      <Text5 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[25%_15%_25%_15.06%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 8">
          <path clipRule="evenodd" d={svgPaths.p153f0d00} fill="var(--fill-0, #00A63E)" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute bg-green-100 box-border content-stretch flex flex-col items-start left-0 pb-0 pt-[4px] px-[4px] rounded-[2.68435e+07px] size-[24px] top-[2px]" data-name="Container">
      <Icon9 />
    </div>
  );
}

function Text6() {
  return (
    <div className="absolute h-[21px] left-[36px] top-0 w-[182.7px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[21px] left-0 not-italic text-[#314158] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">Build community connections</p>
    </div>
  );
}

function ListItem6() {
  return (
    <div className="h-[26px] relative shrink-0 w-full" data-name="List Item">
      <Container9 />
      <Text6 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[25%_15%_25%_15.06%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 8">
          <path clipRule="evenodd" d={svgPaths.p153f0d00} fill="var(--fill-0, #00A63E)" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute bg-green-100 box-border content-stretch flex flex-col items-start left-0 pb-0 pt-[4px] px-[4px] rounded-[2.68435e+07px] size-[24px] top-[2px]" data-name="Container">
      <Icon10 />
    </div>
  );
}

function Text7() {
  return (
    <div className="absolute h-[21px] left-[36px] top-0 w-[173.525px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[21px] left-0 not-italic text-[#314158] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">Powerful management tools</p>
    </div>
  );
}

function ListItem7() {
  return (
    <div className="h-[26px] relative shrink-0 w-full" data-name="List Item">
      <Container10 />
      <Text7 />
    </div>
  );
}

function PartnerLoginChoice3() {
  return (
    <div className="h-[140px] relative shrink-0 w-[364.8px]" data-name="PartnerLoginChoice">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[12px] h-[140px] items-start relative w-[364.8px]">
        <ListItem4 />
        <ListItem5 />
        <ListItem6 />
        <ListItem7 />
      </div>
    </div>
  );
}

function Icon11() {
  return (
    <div className="absolute left-[106.39px] size-[20px] top-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p25397b80} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2c4f400} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M15.8333 6.66667V11.6667" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M18.3333 9.16667H13.3333" id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-gradient-to-r from-2% from-[#8b5943] h-[48px] relative rounded-[10px] shrink-0 to-[#8b5943] via-[#d9bf9d] via-[53.365%] w-[364.8px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[48px] relative w-[364.8px]">
        <Icon11 />
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[142.39px] not-italic text-[14px] text-black text-nowrap top-[12.8px] whitespace-pre">Register Your Café</p>
      </div>
    </div>
  );
}

function Card1() {
  return (
    <div className="[grid-area:1_/_2] bg-white h-[516.2px] relative rounded-[16px] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border-[1.6px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[48px] h-[516.2px] items-start pl-[33.6px] pr-[1.6px] py-[33.6px] relative w-full">
          <PartnerLoginChoice2 />
          <PartnerLoginChoice3 />
          <Button1 />
        </div>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute gap-[32px] grid grid-cols-[repeat(2,_minmax(0px,_1fr))] grid-rows-[repeat(1,_minmax(0px,_1fr))] h-[516.2px] left-0 top-[191px] w-[896px]" data-name="Container">
      <Card />
      <Card1 />
    </div>
  );
}

function Icon12() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%_58.33%_83.33%_41.67%]" data-name="Vector">
        <div className="absolute inset-[-50%_-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 4">
            <path d="M1 1V3" id="Vector" stroke="var(--stroke-0, #E17100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_41.67%_83.33%_58.33%]" data-name="Vector">
        <div className="absolute inset-[-50%_-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 4">
            <path d="M1 1V3" id="Vector" stroke="var(--stroke-0, #E17100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[33.33%_8.33%_12.5%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-7.69%_-5.26%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 15">
            <path d={svgPaths.p96d8b00} id="Vector" stroke="var(--stroke-0, #E17100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[83.33%] left-1/4 right-3/4 top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-50%_-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 4">
            <path d="M1 1V3" id="Vector" stroke="var(--stroke-0, #E17100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="bg-[#fef3c6] relative rounded-[2.68435e+07px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start pb-0 pt-[12px] px-[12px] relative size-[48px]">
        <Icon12 />
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[26px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[26px] left-0 not-italic text-[18px] text-neutral-950 text-nowrap top-[-1.2px] whitespace-pre">Why Partner with Caffélino?</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[45.5px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[22.75px] left-0 not-italic text-[#45556c] text-[14px] top-[-1.4px] w-[746px]">Join hundreds of cafés that are building meaningful connections with their communities. Our platform helps you manage group bookings, track revenue, engage with loyal customers, and grow your business—all from one simple dashboard.</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="basis-0 grow h-[79.5px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[8px] h-[79.5px] items-start relative w-full">
        <Heading2 />
        <Paragraph3 />
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex gap-[16px] h-[79.5px] items-start relative shrink-0 w-full" data-name="Container">
      <Container12 />
      <Container13 />
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col h-[129.1px] items-start left-0 pb-[0.8px] pt-[24.8px] px-[24.8px] rounded-[16px] top-[755.2px] w-[896px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#fee685] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" />
      <Container14 />
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[884.3px] relative shrink-0 w-[896px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[884.3px] relative w-[896px]">
        <Container />
        <Container11 />
        <Container15 />
      </div>
    </div>
  );
}

function PartnerLoginChoice4() {
  return (
    <div className="absolute content-stretch flex h-[916.3px] items-center justify-center left-0 top-0 w-[1151.2px]" data-name="PartnerLoginChoice" style={{ backgroundImage: "linear-gradient(141.482deg, rgb(139, 89, 67) 4.3269%, rgb(217, 191, 157) 50%, rgb(139, 89, 67) 100%), linear-gradient(90deg, rgb(248, 250, 252) 0%, rgb(248, 250, 252) 100%)" }}>
      <Container16 />
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p203476e0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M12.6667 8H3.33333" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[20px] relative shrink-0 w-[28.575px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[28.575px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-0 not-italic text-[14px] text-nowrap text-white top-[-1.2px] whitespace-pre">Back</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="absolute bg-black box-border content-stretch flex gap-[8px] h-[36px] items-center left-[44px] pl-[16px] pr-0 py-0 rounded-[12px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] top-[51.4px] w-[84.575px]" data-name="App">
      <Icon13 />
      <Text8 />
    </div>
  );
}

export default function MeetUpCafeApp() {
  return (
    <div className="bg-[#fffbf5] relative size-full" data-name="MeetUp Café App">
      <PartnerLoginChoice4 />
      <App />
    </div>
  );
}