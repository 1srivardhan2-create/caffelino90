import svgPaths from "./svg-91dnnebl6q";
import clsx from "clsx";
type ButtonBackgroundImageProps = {
  additionalClassNames?: string;
};

function ButtonBackgroundImage({ children, additionalClassNames = "" }: React.PropsWithChildren<ButtonBackgroundImageProps>) {
  return (
    <div className={clsx("absolute bg-white h-[318px] rounded-[16px] top-0", additionalClassNames)}>
      <div className="content-stretch flex flex-col items-start overflow-clip p-[1.6px] relative rounded-[inherit] size-full">{children}</div>
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[1.6px] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}
type ContainerBackgroundImage2Props = {
  additionalClassNames?: string;
};

function ContainerBackgroundImage2({ children, additionalClassNames = "" }: React.PropsWithChildren<ContainerBackgroundImage2Props>) {
  return (
    <div className={clsx("h-[40px] relative shrink-0", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">{children}</div>
    </div>
  );
}
type ContainerBackgroundImage1Props = {
  additionalClassNames?: string;
};

function ContainerBackgroundImage1({ children, additionalClassNames = "" }: React.PropsWithChildren<ContainerBackgroundImage1Props>) {
  return (
    <div className={clsx("relative rounded-[2.68435e+07px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0 size-[40px]", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">{children}</div>
    </div>
  );
}

function BackgroundImage3({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="h-[24px] relative shrink-0 w-full">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] text-nowrap top-[0.2px]">{children}</p>
    </div>
  );
}

function BackgroundImage2({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#6a7282] text-[14px] text-nowrap top-[0.4px]">{children}</p>
    </div>
  );
}

function ContainerBackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="h-[154.8px] relative shrink-0 w-full">
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start pb-0 pt-[16px] px-[16px] relative size-full">{children}</div>
      </div>
    </div>
  );
}
type BackgroundImage1Props = {
  additionalClassNames?: string;
};

function BackgroundImage1({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage1Props>) {
  return (
    <div className={clsx("size-[20px]", additionalClassNames)}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">{children}</g>
      </svg>
    </div>
  );
}

function BackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[16px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">{children}</g>
      </svg>
    </div>
  );
}

function IconBackgroundImage3() {
  return (
    <BackgroundImage>
      <path d={svgPaths.pb3a1300} fill="var(--fill-0, #FFB900)" id="Vector" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
    </BackgroundImage>
  );
}
type TextBackgroundImageAndText5Props = {
  text: string;
  additionalClassNames?: string;
};

function TextBackgroundImageAndText5({ text, additionalClassNames = "" }: TextBackgroundImageAndText5Props) {
  return (
    <div className={clsx("h-[21px] relative shrink-0", additionalClassNames)}>
      <BackgroundImage2>{text}</BackgroundImage2>
    </div>
  );
}
type TextBackgroundImageAndText4Props = {
  text: string;
};

function TextBackgroundImageAndText4({ text }: TextBackgroundImageAndText4Props) {
  return (
    <div className="h-[24px] relative shrink-0 w-[35.6px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#be9d80] text-[16px] top-[0.2px] w-[36px]">{text}</p>
      </div>
    </div>
  );
}
type TextBackgroundImageAndText3Props = {
  text: string;
};

function TextBackgroundImageAndText3({ text }: TextBackgroundImageAndText3Props) {
  return (
    <div className="h-[21px] relative shrink-0 w-[4.912px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#99a1af] text-[14px] text-nowrap top-[0.4px]">{text}</p>
      </div>
    </div>
  );
}

function IconBackgroundImage2() {
  return (
    <BackgroundImage>
      <path d={svgPaths.p1cb7cc00} fill="var(--fill-0, #FFB900)" id="Vector" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
    </BackgroundImage>
  );
}

function IconBackgroundImage1() {
  return (
    <BackgroundImage>
      <path d={svgPaths.p14548f00} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
      <path d={svgPaths.p17781bc0} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
    </BackgroundImage>
  );
}
type HeadingBackgroundImageAndTextProps = {
  text: string;
};

function HeadingBackgroundImageAndText({ text }: HeadingBackgroundImageAndTextProps) {
  return <BackgroundImage3>{text}</BackgroundImage3>;
}
type BackgroundImageAndTextProps = {
  text: string;
};

function BackgroundImageAndText({ text }: BackgroundImageAndTextProps) {
  return (
    <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.4px]">{text}</p>
    </div>
  );
}
type TextBackgroundImageAndText2Props = {
  text: string;
  additionalClassNames?: string;
};

function TextBackgroundImageAndText2({ text, additionalClassNames = "" }: TextBackgroundImageAndText2Props) {
  return (
    <div className={clsx("h-[21px] relative shrink-0", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#364153] text-[14px] text-nowrap top-[0.4px]">{text}</p>
      </div>
    </div>
  );
}
type TextBackgroundImageAndText1Props = {
  text: string;
};

function TextBackgroundImageAndText1({ text }: TextBackgroundImageAndText1Props) {
  return (
    <div className="h-[27px] relative shrink-0 w-[24.725px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[27px] left-0 not-italic text-[#2c1810] text-[18px] text-nowrap top-[-2.2px]">{text}</p>
      </div>
    </div>
  );
}
type TextBackgroundImageAndTextProps = {
  text: string;
  additionalClassNames?: string;
};

function TextBackgroundImageAndText({ text, additionalClassNames = "" }: TextBackgroundImageAndTextProps) {
  return (
    <div className={clsx("h-[21px] relative shrink-0", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Bold',sans-serif] leading-[21px] left-0 not-italic text-[#0a0a0a] text-[14px] text-nowrap top-[0.4px]">{text}</p>
      </div>
    </div>
  );
}

function IconBackgroundImage() {
  return (
    <BackgroundImage1 additionalClassNames="relative shrink-0">
      <path d={svgPaths.p127122c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
    </BackgroundImage1>
  );
}

function Container() {
  return <div className="bg-[#00c950] h-[2px] shrink-0 w-[80px]" data-name="Container" />;
}

export default function CafeSelectionCreate() {
  return (
    <div className="relative size-full" data-name="CafeSelectionCreate" style={{ backgroundImage: "linear-gradient(235.157deg, rgb(139, 89, 67) 3.9852%, rgb(217, 191, 157) 42.96%, rgb(139, 89, 67) 81.936%)" }}>
      <div className="absolute bg-white content-stretch flex flex-col h-[59.8px] items-start left-0 pb-[0.8px] pt-0 px-[60px] top-0 w-[1144px]" data-name="Container">
        <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0px_0px_0.8px] border-solid inset-0 pointer-events-none" />
        <div className="h-[59px] relative shrink-0 w-full" data-name="Container">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex items-center justify-between px-[24px] py-0 relative size-full">
              <div className="h-[24px] relative shrink-0 w-[56.025px]" data-name="Button">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
                  <p className="font-['Arial:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#0a0a0a] text-[16px] text-center text-nowrap">← Back</p>
                </div>
              </div>
              <div className="h-[27px] relative shrink-0 w-[125.05px]" data-name="Container">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
                  <BackgroundImage1 additionalClassNames="relative shrink-0">
                    <path d="M8.33333 1.66667V3.33333" id="Vector" stroke="var(--stroke-0, #A8825D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d="M11.6667 1.66667V3.33333" id="Vector_2" stroke="var(--stroke-0, #A8825D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d={svgPaths.p257a4f00} id="Vector_3" stroke="var(--stroke-0, #A8825D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d="M5 1.66667V3.33333" id="Vector_4" stroke="var(--stroke-0, #A8825D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  </BackgroundImage1>
                  <div className="h-[27px] relative shrink-0 w-[97.05px]" data-name="Heading 1">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                      <p className="absolute font-['Arial:Bold',sans-serif] leading-[27px] left-0 not-italic text-[#0a0a0a] text-[18px] text-nowrap top-[0.2px]">Select Café</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-0 shrink-0 w-[80px]" data-name="Container" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute content-stretch flex gap-[12px] h-[40px] items-center justify-center left-[84px] pl-0 pr-[0.012px] py-0 top-[91.8px] w-[976px]" data-name="Container">
        <ContainerBackgroundImage2 additionalClassNames="w-[97.912px]">
          <ContainerBackgroundImage1 additionalClassNames="bg-[#00c950]">
            <IconBackgroundImage />
          </ContainerBackgroundImage1>
          <TextBackgroundImageAndText text="Details" additionalClassNames="w-[45.913px]" />
        </ContainerBackgroundImage2>
        <Container />
        <ContainerBackgroundImage2 additionalClassNames="w-[87px]">
          <div className="basis-0 bg-[#00c950] grow h-[40px] min-h-px min-w-px relative rounded-[2.68435e+07px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0" data-name="Container">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
              <IconBackgroundImage />
            </div>
          </div>
          <TextBackgroundImageAndText text="Code" additionalClassNames="w-[35px]" />
        </ContainerBackgroundImage2>
        <Container />
        <ContainerBackgroundImage2 additionalClassNames="w-[82.35px]">
          <ContainerBackgroundImage1 additionalClassNames="bg-[#c9b5a0]">
            <div className="h-[24px] relative shrink-0 w-[8.9px]" data-name="Text">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#0a0a0a] text-[16px] text-nowrap top-[0.2px]">3</p>
              </div>
            </div>
          </ContainerBackgroundImage1>
          <TextBackgroundImageAndText text="Café" additionalClassNames="w-[30.35px]" />
        </ContainerBackgroundImage2>
      </div>
      <div className="absolute content-stretch flex flex-col gap-[24px] h-[1138.2px] items-start left-[60px] px-[24px] py-0 top-[163.8px] w-[1024px]" data-name="Container">
        <div className="bg-gradient-to-b from-[#f5ebe0] h-[210.4px] relative rounded-[16px] shrink-0 to-[#e3d5ca] w-full" data-name="Container">
          <div aria-hidden="true" className="absolute border-[#be9d80] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[16px]" />
          <div className="size-full">
            <div className="content-stretch flex flex-col gap-[16px] items-start pb-[0.8px] pt-[24.8px] px-[24.8px] relative size-full">
              <div className="h-[52px] relative shrink-0 w-full" data-name="Container">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex items-center justify-between relative size-full">
                    <div className="h-[52px] relative shrink-0 w-[164.3px]" data-name="Container">
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
                        <div className="content-stretch flex gap-[8px] h-[27px] items-center relative shrink-0 w-full" data-name="Container">
                          <BackgroundImage1 additionalClassNames="relative shrink-0">
                            <path d={svgPaths.p25397b80} id="Vector" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                            <path d={svgPaths.p18e6a68} id="Vector_2" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                            <path d={svgPaths.p2241fff0} id="Vector_3" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                            <path d={svgPaths.p2c4f400} id="Vector_4" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          </BackgroundImage1>
                          <div className="basis-0 grow h-[27px] min-h-px min-w-px relative shrink-0" data-name="Heading 3">
                            <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                              <p className="absolute font-['Arial:Bold',sans-serif] leading-[27px] left-0 not-italic text-[#101828] text-[18px] top-[0.2px] w-[137px]">{`bunny's Meetup`}</p>
                            </div>
                          </div>
                        </div>
                        <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
                          <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#364153] text-[14px] top-[0.4px] w-[154px]">Wed, Dec 31 • 12:49 PM</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white h-[40px] relative rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0 w-[94.388px]" data-name="Container">
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-0 pt-[8px] px-[16px] relative size-full">
                        <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
                          <p className="absolute font-['Consolas:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#be9d80] text-[16px] text-nowrap top-[-0.6px] tracking-[1.6px]">S70NYU</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[12px] h-[92.8px] items-start pb-0 pt-[16.8px] px-0 relative shrink-0 w-full" data-name="Container">
                <div aria-hidden="true" className="absolute border-[0.8px_0px_0px] border-[rgba(190,157,128,0.3)] border-solid inset-0 pointer-events-none" />
                <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
                  <BackgroundImage>
                    <path d={svgPaths.p32887f80} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    <path d={svgPaths.p3b6ee540} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    <path d={svgPaths.p188b8380} id="Vector_3" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    <path d={svgPaths.p3694d280} id="Vector_4" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  </BackgroundImage>
                  <div className="h-[21px] relative shrink-0 w-[82.475px]" data-name="Text">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                      <p className="absolute font-['Arial:Bold',sans-serif] leading-[21px] left-0 not-italic text-[#364153] text-[14px] top-[0.4px] w-[83px]">Members (4)</p>
                    </div>
                  </div>
                </div>
                <div className="h-[43px] relative shrink-0 w-full" data-name="Container">
                  <div className="absolute bg-white content-stretch flex gap-[8px] h-[43px] items-center left-0 pl-[12px] pr-0 py-0 rounded-[2.68435e+07px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-0 w-[83.963px]" data-name="Container">
                    <TextBackgroundImageAndText1 text="👨" />
                    <TextBackgroundImageAndText2 text="Alex" additionalClassNames="w-[27.238px]" />
                  </div>
                  <div className="absolute bg-white content-stretch flex gap-[8px] h-[43px] items-center left-[91.96px] pl-[12px] pr-0 py-0 rounded-[2.68435e+07px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-0 w-[94.088px]" data-name="Container">
                    <TextBackgroundImageAndText1 text="👩" />
                    <TextBackgroundImageAndText2 text="Sarah" additionalClassNames="w-[37.362px]" />
                  </div>
                  <div className="absolute bg-white content-stretch flex gap-[8px] h-[43px] items-center left-[194.05px] pl-[12px] pr-0 py-0 rounded-[2.68435e+07px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-0 w-[86.287px]" data-name="Container">
                    <TextBackgroundImageAndText1 text="👨‍💼" />
                    <TextBackgroundImageAndText2 text="Mike" additionalClassNames="w-[29.563px]" />
                  </div>
                  <div className="absolute bg-white content-stretch flex gap-[8px] h-[43px] items-center left-[288.34px] pl-[12px] pr-0 py-0 rounded-[2.68435e+07px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-0 w-[97.175px]" data-name="Container">
                    <TextBackgroundImageAndText1 text="👩‍💻" />
                    <TextBackgroundImageAndText2 text="Emma" additionalClassNames="w-[40.45px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white h-[101.6px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
          <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
          <div className="size-full">
            <div className="content-stretch flex flex-col items-start pb-[0.8px] pt-[24.8px] px-[24.8px] relative size-full">
              <div className="h-[52px] relative shrink-0 w-full" data-name="Container">
                <div className="absolute content-stretch flex flex-col gap-[4px] h-[52px] items-start left-0 top-0 w-[216.325px]" data-name="Container">
                  <div className="h-[27px] relative shrink-0 w-full" data-name="Heading 3">
                    <p className="absolute font-['Arial:Bold',sans-serif] leading-[27px] left-0 not-italic text-[#101828] text-[18px] text-nowrap top-[0.2px]">Enable Voting</p>
                  </div>
                  <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
                    <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.4px]">Select 3 cafés for members to vote</p>
                  </div>
                </div>
                <div className="absolute bg-[#00c950] content-stretch flex flex-col h-[32px] items-start left-[862.4px] pb-0 pl-[36px] pr-[4px] pt-[4px] rounded-[2.68435e+07px] top-[10px] w-[64px]" data-name="Button">
                  <div className="bg-white h-[24px] rounded-[2.68435e+07px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Container" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[59.2px] relative shrink-0 w-full" data-name="Container">
          <div className="absolute bg-[rgba(168,130,93,0.15)] h-[59.2px] left-0 rounded-[16px] top-0 w-[976px]" data-name="Text Input">
            <div className="content-stretch flex items-center overflow-clip pl-[48px] pr-[16px] py-[16px] relative rounded-[inherit] size-full">
              <p className="font-['Arial:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#2c1810] text-[16px] text-nowrap">Search cafés by name or area</p>
            </div>
            <div aria-hidden="true" className="absolute border-[#a8825d] border-[1.6px] border-solid inset-0 pointer-events-none rounded-[16px]" />
          </div>
          <BackgroundImage1 additionalClassNames="absolute left-[16px] top-[19.6px]">
            <path d="M17.5 17.5L13.8833 13.8833" id="Vector" stroke="var(--stroke-0, #2C1810)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
            <path d={svgPaths.pcddfd00} id="Vector_2" stroke="var(--stroke-0, #2C1810)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </BackgroundImage1>
        </div>
        <div className="content-stretch flex flex-col gap-[16px] h-[695px] items-start relative shrink-0 w-full" data-name="Container">
          <div className="content-stretch flex h-[27px] items-center justify-between relative shrink-0 w-full" data-name="Container">
            <div className="h-[27px] relative shrink-0 w-[122.075px]" data-name="Heading 2">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                <p className="absolute font-['Arial:Bold',sans-serif] leading-[27px] left-0 not-italic text-[#101828] text-[18px] text-nowrap top-[0.2px]">Select 3 Cafés</p>
              </div>
            </div>
            <div className="h-[21px] relative shrink-0 w-[83.287px]" data-name="Text">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#1e1e1e] text-[14px] top-[0.4px] w-[84px]">0 / 3 selected</p>
              </div>
            </div>
          </div>
          <div className="h-[652px] relative shrink-0 w-full" data-name="Container">
            <ButtonBackgroundImage additionalClassNames="left-0 w-[314.663px]">
              <div className="content-stretch flex flex-col h-[160px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
                <div className="h-[160px] shrink-0 w-full" data-name="Image (Café Mocha)" />
              </div>
              <ContainerBackgroundImage>
                <HeadingBackgroundImageAndText text="Café Mocha" />
                <div className="content-stretch flex flex-col gap-[8px] h-[90.8px] items-start relative shrink-0 w-full" data-name="Container">
                  <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
                    <IconBackgroundImage1 />
                    <div className="h-[21px] relative shrink-0 w-[83.287px]" data-name="Text">
                      <BackgroundImageAndText text="Koramangala" />
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
                    <IconBackgroundImage2 />
                    <div className="h-[21px] relative shrink-0 w-[19.462px]" data-name="Text">
                      <BackgroundImageAndText text="4.5" />
                    </div>
                    <TextBackgroundImageAndText3 text="•" />
                    <div className="h-[21px] relative shrink-0 w-[85.825px]" data-name="Text">
                      <BackgroundImage2>{`Cozy & Warm`}</BackgroundImage2>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[8px] h-[32.8px] items-center pb-0 pt-[0.8px] px-0 relative shrink-0 w-full" data-name="Container">
                    <div aria-hidden="true" className="absolute border-[#f3f4f6] border-[0.8px_0px_0px] border-solid inset-0 pointer-events-none" />
                    <TextBackgroundImageAndText4 text="₹250" />
                    <TextBackgroundImageAndText5 text="per person" additionalClassNames="w-[66.938px]" />
                  </div>
                </div>
              </ContainerBackgroundImage>
            </ButtonBackgroundImage>
            <ButtonBackgroundImage additionalClassNames="left-[330.66px] w-[314.663px]">
              <div className="content-stretch flex flex-col h-[160px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
                <div className="h-[160px] shrink-0 w-full" data-name="Image (The Coffee Bean)" />
              </div>
              <ContainerBackgroundImage>
                <HeadingBackgroundImageAndText text="The Coffee Bean" />
                <div className="content-stretch flex flex-col gap-[8px] h-[90.8px] items-start relative shrink-0 w-full" data-name="Container">
                  <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
                    <IconBackgroundImage1 />
                    <div className="h-[21px] relative shrink-0 w-[70.838px]" data-name="Text">
                      <BackgroundImageAndText text="Indiranagar" />
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
                    <IconBackgroundImage2 />
                    <div className="h-[21px] relative shrink-0 w-[19.462px]" data-name="Text">
                      <BackgroundImageAndText text="4.3" />
                    </div>
                    <TextBackgroundImageAndText3 text="•" />
                    <TextBackgroundImageAndText5 text="Minimalist" additionalClassNames="w-[62.237px]" />
                  </div>
                  <div className="content-stretch flex gap-[8px] h-[32.8px] items-center pb-0 pt-[0.8px] px-0 relative shrink-0 w-full" data-name="Container">
                    <div aria-hidden="true" className="absolute border-[#f3f4f6] border-[0.8px_0px_0px] border-solid inset-0 pointer-events-none" />
                    <TextBackgroundImageAndText4 text="₹180" />
                    <TextBackgroundImageAndText5 text="per person" additionalClassNames="w-[66.938px]" />
                  </div>
                </div>
              </ContainerBackgroundImage>
            </ButtonBackgroundImage>
            <ButtonBackgroundImage additionalClassNames="left-[661.33px] w-[314.675px]">
              <div className="content-stretch flex flex-col h-[160px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
                <div className="h-[160px] shrink-0 w-full" data-name="Image (Brew & Bites)" />
              </div>
              <ContainerBackgroundImage>
                <BackgroundImage3>{`Brew & Bites`}</BackgroundImage3>
                <div className="content-stretch flex flex-col gap-[8px] h-[90.8px] items-start relative shrink-0 w-full" data-name="Container">
                  <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
                    <IconBackgroundImage1 />
                    <div className="h-[21px] relative shrink-0 w-[75.488px]" data-name="Text">
                      <BackgroundImageAndText text="HSR Layout" />
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
                    <IconBackgroundImage3 />
                    <div className="h-[21px] relative shrink-0 w-[19.462px]" data-name="Text">
                      <BackgroundImageAndText text="4.7" />
                    </div>
                    <TextBackgroundImageAndText3 text="•" />
                    <TextBackgroundImageAndText5 text="Premium" additionalClassNames="w-[56.013px]" />
                  </div>
                  <div className="content-stretch flex gap-[8px] h-[32.8px] items-center pb-0 pt-[0.8px] px-0 relative shrink-0 w-full" data-name="Container">
                    <div aria-hidden="true" className="absolute border-[#f3f4f6] border-[0.8px_0px_0px] border-solid inset-0 pointer-events-none" />
                    <TextBackgroundImageAndText4 text="₹300" />
                    <TextBackgroundImageAndText5 text="per person" additionalClassNames="w-[66.938px]" />
                  </div>
                </div>
              </ContainerBackgroundImage>
            </ButtonBackgroundImage>
            <div className="absolute bg-white border-[#e5e7eb] border-[1.6px] border-solid h-[318px] left-0 overflow-clip rounded-[16px] top-[334px] w-[314.663px]" data-name="Button">
              <div className="absolute content-stretch flex flex-col gap-[8px] h-[154.8px] items-start left-0 pb-0 pt-[16px] px-[16px] top-[160px] w-[311.462px]" data-name="Container">
                <HeadingBackgroundImageAndText text="Urban Grind" />
                <div className="content-stretch flex flex-col gap-[8px] h-[90.8px] items-start relative shrink-0 w-full" data-name="Container">
                  <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
                    <IconBackgroundImage1 />
                    <div className="h-[21px] relative shrink-0 w-[61.475px]" data-name="Text">
                      <BackgroundImageAndText text="Whitefield" />
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
                    <IconBackgroundImage2 />
                    <div className="h-[21px] relative shrink-0 w-[19.462px]" data-name="Text">
                      <BackgroundImageAndText text="4.4" />
                    </div>
                    <TextBackgroundImageAndText3 text="•" />
                    <TextBackgroundImageAndText5 text="Modern" additionalClassNames="w-[47.475px]" />
                  </div>
                  <div className="content-stretch flex gap-[8px] h-[32.8px] items-center pb-0 pt-[0.8px] px-0 relative shrink-0 w-full" data-name="Container">
                    <div aria-hidden="true" className="absolute border-[#f3f4f6] border-[0.8px_0px_0px] border-solid inset-0 pointer-events-none" />
                    <TextBackgroundImageAndText4 text="₹220" />
                    <TextBackgroundImageAndText5 text="per person" additionalClassNames="w-[66.938px]" />
                  </div>
                </div>
              </div>
              <div className="absolute content-stretch flex flex-col h-[160px] items-start left-0 overflow-clip top-0 w-[311.462px]" data-name="Container">
                <div className="h-[160px] shrink-0 w-full" data-name="Image (Urban Grind)" />
              </div>
            </div>
            <div className="absolute bg-white border-[#e5e7eb] border-[1.6px] border-solid h-[318px] left-[330.66px] overflow-clip rounded-[16px] top-[334px] w-[314.663px]" data-name="Button">
              <div className="absolute content-stretch flex flex-col gap-[8px] h-[154.8px] items-start left-0 pb-0 pt-[16px] px-[16px] top-[160px] w-[311.462px]" data-name="Container">
                <HeadingBackgroundImageAndText text="Espresso House" />
                <div className="content-stretch flex flex-col gap-[8px] h-[90.8px] items-start relative shrink-0 w-full" data-name="Container">
                  <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
                    <IconBackgroundImage1 />
                    <div className="h-[21px] relative shrink-0 w-[59.913px]" data-name="Text">
                      <BackgroundImageAndText text="MG Road" />
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
                    <IconBackgroundImage2 />
                    <div className="h-[21px] relative shrink-0 w-[19.462px]" data-name="Text">
                      <BackgroundImageAndText text="4.6" />
                    </div>
                    <TextBackgroundImageAndText3 text="•" />
                    <TextBackgroundImageAndText5 text="Classic" additionalClassNames="w-[45.125px]" />
                  </div>
                  <div className="content-stretch flex gap-[8px] h-[32.8px] items-center pb-0 pt-[0.8px] px-0 relative shrink-0 w-full" data-name="Container">
                    <div aria-hidden="true" className="absolute border-[#f3f4f6] border-[0.8px_0px_0px] border-solid inset-0 pointer-events-none" />
                    <TextBackgroundImageAndText4 text="₹200" />
                    <TextBackgroundImageAndText5 text="per person" additionalClassNames="w-[66.938px]" />
                  </div>
                </div>
              </div>
              <div className="absolute content-stretch flex flex-col h-[160px] items-start left-0 overflow-clip top-0 w-[311.462px]" data-name="Container">
                <div className="h-[160px] shrink-0 w-full" data-name="Image (Espresso House)" />
              </div>
            </div>
            <div className="absolute bg-white border-[#e5e7eb] border-[1.6px] border-solid h-[318px] left-[661.33px] overflow-clip rounded-[16px] top-[334px] w-[314.675px]" data-name="Button">
              <div className="absolute content-stretch flex flex-col gap-[8px] h-[154.8px] items-start left-0 pb-0 pt-[16px] px-[16px] top-[160px] w-[311.475px]" data-name="Container">
                <BackgroundImage3>{`Chai & Chatter`}</BackgroundImage3>
                <div className="content-stretch flex flex-col gap-[8px] h-[90.8px] items-start relative shrink-0 w-full" data-name="Container">
                  <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
                    <IconBackgroundImage1 />
                    <div className="h-[21px] relative shrink-0 w-[65.388px]" data-name="Text">
                      <BackgroundImageAndText text="Jayanagar" />
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
                    <IconBackgroundImage3 />
                    <div className="h-[21px] relative shrink-0 w-[19.462px]" data-name="Text">
                      <BackgroundImageAndText text="4.2" />
                    </div>
                    <TextBackgroundImageAndText3 text="•" />
                    <TextBackgroundImageAndText5 text="Casual" additionalClassNames="w-[43.588px]" />
                  </div>
                  <div className="content-stretch flex gap-[8px] h-[32.8px] items-center pb-0 pt-[0.8px] px-0 relative shrink-0 w-full" data-name="Container">
                    <div aria-hidden="true" className="absolute border-[#f3f4f6] border-[0.8px_0px_0px] border-solid inset-0 pointer-events-none" />
                    <TextBackgroundImageAndText4 text="₹150" />
                    <TextBackgroundImageAndText5 text="per person" additionalClassNames="w-[66.938px]" />
                  </div>
                </div>
              </div>
              <div className="absolute content-stretch flex flex-col h-[160px] items-start left-0 overflow-clip top-0 w-[311.475px]" data-name="Container">
                <div className="h-[160px] shrink-0 w-full" data-name="Image (Chai & Chatter)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}