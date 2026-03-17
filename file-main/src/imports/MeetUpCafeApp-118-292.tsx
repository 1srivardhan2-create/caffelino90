import svgPaths from "./svg-fpideojqow";

function Heading1() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[48px] left-[448.73px] not-italic text-[40px] text-center text-neutral-950 text-nowrap top-[-4.2px] translate-x-[-50%] whitespace-pre">Partner with Caffélino</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[27px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[27px] left-[448.21px] not-italic text-[#314158] text-[18px] text-center text-nowrap top-[-2.2px] translate-x-[-50%] whitespace-pre">Join our network of cafés and connect with amazing communities</p>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[91px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading1 />
      <Paragraph />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[12.5%]" data-name="Group">
      <div className="absolute inset-[-5.56%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 34">
          <g id="Group">
            <path d={svgPaths.p126c7780} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
            <path d="M21.6667 16.6667H1.66666" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
            <path d={svgPaths.p171c8ec0} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="Icon">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border overflow-clip relative rounded-[inherit] size-[40px]">
        <Group />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute bg-[#be9d80] content-stretch flex items-center justify-center left-[176px] rounded-[2.68435e+07px] size-[80px] top-[32px]" data-name="Container">
      <Icon />
    </div>
  );
}

function Heading2() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-start left-[32px] top-[136px] w-[368px]" data-name="Heading 2">
      <p className="basis-0 font-['Arial:Regular',sans-serif] grow leading-[32px] min-h-px min-w-px not-italic relative shrink-0 text-[24px] text-center text-neutral-950">Already Registered?</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[21px] left-[32px] top-[176px] w-[368px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-[183.75px] not-italic text-[#45556c] text-[14px] text-center text-nowrap top-[-1.2px] translate-x-[-50%] whitespace-pre">Sign in to access your café dashboard</p>
    </div>
  );
}

function Icon1() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[16.67%] left-0 right-[6.75%] top-[16.67%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 11">
          <path clipRule="evenodd" d={svgPaths.p39063b00} fill="var(--fill-0, #4F39F6)" fillRule="evenodd" id="Vector" />
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
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#314158] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">{`Manage bookings & orders`}</p>
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
      <div className="absolute bottom-[16.67%] left-0 right-[6.75%] top-[16.67%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 11">
          <path clipRule="evenodd" d={svgPaths.p39063b00} fill="var(--fill-0, #4F39F6)" fillRule="evenodd" id="Vector" />
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
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#314158] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">{`Track revenue & payments`}</p>
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
      <div className="absolute bottom-[16.67%] left-0 right-[6.75%] top-[16.67%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 11">
          <path clipRule="evenodd" d={svgPaths.p39063b00} fill="var(--fill-0, #4F39F6)" fillRule="evenodd" id="Vector" />
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
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#314158] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">Engage with loyal groups</p>
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
      <div className="absolute bottom-[16.67%] left-0 right-[6.75%] top-[16.67%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 11">
          <path clipRule="evenodd" d={svgPaths.p39063b00} fill="var(--fill-0, #4F39F6)" fillRule="evenodd" id="Vector" />
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
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#314158] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">{`Update menu & profile`}</p>
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

function List() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[140px] items-start left-[32px] top-[245px] w-[368px]" data-name="List">
      <ListItem />
      <ListItem1 />
      <ListItem2 />
      <ListItem3 />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[12.5%]" data-name="Group">
      <div className="absolute inset-[-5.556%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
          <g id="Group">
            <path d={svgPaths.p340df400} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
            <path d="M10.8333 8.33333H0.833335" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
            <path d={svgPaths.p362dc100} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border overflow-clip relative rounded-[inherit] size-[20px]">
        <Group1 />
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[21px] relative shrink-0 w-[42.487px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[42.487px]">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[14px] text-black text-nowrap top-[-1.2px] whitespace-pre">Sign In</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-gradient-to-b box-border content-stretch flex from-[#8b5943] gap-[8px] h-[48px] items-center justify-center left-[32px] pl-0 pr-[0.013px] py-0 rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] to-[#8b5943] top-[433px] via-50% via-[#d9bf9d] w-[368px]" data-name="Button">
      <Icon5 />
      <Text4 />
    </div>
  );
}

function Container6() {
  return (
    <div className="[grid-area:1_/_1] bg-white relative rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0" data-name="Container">
      <Container1 />
      <Heading2 />
      <Paragraph1 />
      <List />
      <Button />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[12.5%_8.33%]" data-name="Group">
      <div className="absolute inset-[-5.56%_-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 37 34">
          <g id="Group">
            <path d={svgPaths.p1a232700} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
            <path d={svgPaths.p1bbf7800} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
            <path d="M30 9.99996V20" id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
            <path d="M35 15H25" id="Vector_4" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="Icon">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border overflow-clip relative rounded-[inherit] size-[40px]">
        <Group2 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute bg-[#be9d80] content-stretch flex items-center justify-center left-[176px] rounded-[2.68435e+07px] size-[80px] top-[32px]" data-name="Container">
      <Icon6 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-start left-[32px] top-[136px] w-[368px]" data-name="Heading 2">
      <p className="basis-0 font-['Arial:Regular',sans-serif] grow leading-[32px] min-h-px min-w-px not-italic relative shrink-0 text-[24px] text-center text-neutral-950">Register Now</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute h-[21px] left-[32px] top-[176px] w-[368px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-[183.57px] not-italic text-[#45556c] text-[14px] text-center text-nowrap top-[-1.2px] translate-x-[-50%] whitespace-pre">New to Caffélino? Get started today</p>
    </div>
  );
}

function Icon7() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[16.67%] left-0 right-[6.75%] top-[16.67%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 11">
          <path clipRule="evenodd" d={svgPaths.p39063b00} fill="var(--fill-0, #00A63E)" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute bg-green-100 box-border content-stretch flex flex-col items-start left-0 pb-0 pt-[4px] px-[4px] rounded-[2.68435e+07px] size-[24px] top-[2px]" data-name="Container">
      <Icon7 />
    </div>
  );
}

function Text5() {
  return (
    <div className="absolute h-[21px] left-[36px] top-0 w-[166.95px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#314158] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">{`Free to join & list your café`}</p>
    </div>
  );
}

function ListItem4() {
  return (
    <div className="h-[26px] relative shrink-0 w-full" data-name="List Item">
      <Container8 />
      <Text5 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[16.67%] left-0 right-[6.75%] top-[16.67%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 11">
          <path clipRule="evenodd" d={svgPaths.p39063b00} fill="var(--fill-0, #00A63E)" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute bg-green-100 box-border content-stretch flex flex-col items-start left-0 pb-0 pt-[4px] px-[4px] rounded-[2.68435e+07px] size-[24px] top-[2px]" data-name="Container">
      <Icon8 />
    </div>
  );
}

function Text6() {
  return (
    <div className="absolute h-[21px] left-[36px] top-0 w-[133.3px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#314158] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">Reach new customers</p>
    </div>
  );
}

function ListItem5() {
  return (
    <div className="h-[26px] relative shrink-0 w-full" data-name="List Item">
      <Container9 />
      <Text6 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[16.67%] left-0 right-[6.75%] top-[16.67%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 11">
          <path clipRule="evenodd" d={svgPaths.p39063b00} fill="var(--fill-0, #00A63E)" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute bg-green-100 box-border content-stretch flex flex-col items-start left-0 pb-0 pt-[4px] px-[4px] rounded-[2.68435e+07px] size-[24px] top-[2px]" data-name="Container">
      <Icon9 />
    </div>
  );
}

function Text7() {
  return (
    <div className="absolute h-[21px] left-[36px] top-0 w-[182.7px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#314158] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">Build community connections</p>
    </div>
  );
}

function ListItem6() {
  return (
    <div className="h-[26px] relative shrink-0 w-full" data-name="List Item">
      <Container10 />
      <Text7 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[16.67%] left-0 right-[6.75%] top-[16.67%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 11">
          <path clipRule="evenodd" d={svgPaths.p39063b00} fill="var(--fill-0, #00A63E)" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute bg-green-100 box-border content-stretch flex flex-col items-start left-0 pb-0 pt-[4px] px-[4px] rounded-[2.68435e+07px] size-[24px] top-[2px]" data-name="Container">
      <Icon10 />
    </div>
  );
}

function Text8() {
  return (
    <div className="absolute h-[21px] left-[36px] top-0 w-[173.525px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#314158] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">Powerful management tools</p>
    </div>
  );
}

function ListItem7() {
  return (
    <div className="h-[26px] relative shrink-0 w-full" data-name="List Item">
      <Container11 />
      <Text8 />
    </div>
  );
}

function List1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[140px] items-start left-[32px] top-[245px] w-[368px]" data-name="List">
      <ListItem4 />
      <ListItem5 />
      <ListItem6 />
      <ListItem7 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute inset-[12.5%_8.33%]" data-name="Group">
      <div className="absolute inset-[-5.56%_-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 17">
          <g id="Group">
            <path d={svgPaths.p19805780} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
            <path d={svgPaths.p10fdbe80} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
            <path d="M15 5V10" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
            <path d="M17.5 7.5H12.5" id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border overflow-clip relative rounded-[inherit] size-[20px]">
        <Group3 />
      </div>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[21px] relative shrink-0 w-[112.463px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[112.463px]">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[14px] text-black text-nowrap top-[-1.2px] whitespace-pre">Register Your Café</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute bg-gradient-to-b box-border content-stretch flex from-[#8b5943] gap-[8px] h-[48px] items-center justify-center left-[32px] pl-0 pr-[0.013px] py-0 rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] to-[#8b5943] top-[433px] via-50% via-[#d9bf9d] w-[368px]" data-name="Button">
      <Icon11 />
      <Text9 />
    </div>
  );
}

function Container12() {
  return (
    <div className="[grid-area:1_/_2] bg-white relative rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0" data-name="Container">
      <Container7 />
      <Heading4 />
      <Paragraph2 />
      <List1 />
      <Button1 />
    </div>
  );
}

function Container13() {
  return (
    <div className="gap-[32px] grid grid-cols-[repeat(2,_minmax(0px,_1fr))] grid-rows-[repeat(1,_minmax(0px,_1fr))] h-[513px] relative shrink-0 w-full" data-name="Container">
      <Container6 />
      <Container12 />
    </div>
  );
}

function Icon12() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[4.17%_16.67%_41.67%_4.17%]" data-name="Vector">
        <div className="absolute inset-[-7.69%_-5.26%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 15">
            <path d={svgPaths.p96d8b00} id="Vector" stroke="var(--stroke-0, #E17100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="bg-[#fef3c6] relative rounded-[2.68435e+07px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start pb-0 pt-[12px] px-[12px] relative size-[48px]">
        <Icon12 />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[26px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[26px] left-0 not-italic text-[18px] text-neutral-950 text-nowrap top-[-1.2px] whitespace-pre">Why Partner with Caffélino?</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[45.5px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[22.75px] left-0 not-italic text-[#45556c] text-[14px] top-[-1.4px] w-[746px]">Join hundreds of cafés that are building meaningful connections with their communities. Our platform helps you manage group bookings, track revenue, engage with loyal customers, and grow your business—all from one simple dashboard.</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="basis-0 grow h-[79.5px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[8px] h-[79.5px] items-start relative w-full">
        <Heading3 />
        <Paragraph3 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex gap-[16px] h-[79.5px] items-start relative shrink-0 w-full" data-name="Container">
      <Container14 />
      <Container15 />
    </div>
  );
}

function Container17() {
  return (
    <div className="bg-white h-[129.1px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#fee685] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[129.1px] items-start pb-[0.8px] pt-[24.8px] px-[24.8px] relative w-full">
          <Container16 />
        </div>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[48px] h-[829.1px] items-start left-[127.6px] top-[32px] w-[896px]" data-name="Container">
      <Container />
      <Container13 />
      <Container17 />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute inset-[20.833%]" data-name="Group">
      <div className="absolute inset-[-7.143%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
          <g id="Group">
            <path d={svgPaths.p1e27af80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
            <path d="M10 5.33333H0.666665" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border overflow-clip relative rounded-[inherit] size-[16px]">
        <Group4 />
      </div>
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[21px] relative shrink-0 w-[28.575px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[28.575px]">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[14px] text-nowrap text-white top-[-1.2px] whitespace-pre">Back</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute bg-black box-border content-stretch flex gap-[8px] h-[37px] items-center left-[48px] pl-[16px] pr-0 py-0 rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] top-[48px] w-[84.575px]" data-name="Button">
      <Icon13 />
      <Text10 />
    </div>
  );
}

function PartnerLoginChoice() {
  return (
    <div className="absolute h-[893.1px] left-0 top-0 w-[1151.2px]" data-name="PartnerLoginChoice" style={{ backgroundImage: "linear-gradient(148.305deg, rgb(139, 89, 67) 8.4573%, rgb(217, 191, 157) 50%, rgb(139, 89, 67) 95.478%), linear-gradient(90deg, rgb(248, 250, 252) 0%, rgb(248, 250, 252) 100%), linear-gradient(90deg, rgb(248, 250, 252) 0%, rgb(248, 250, 252) 100%)" }}>
      <Container18 />
      <Button2 />
    </div>
  );
}

export default function MeetUpCafeApp() {
  return (
    <div className="bg-[#fffbf5] relative size-full" data-name="MeetUp Café App">
      <PartnerLoginChoice />
    </div>
  );
}