import svgPaths from "./svg-k54bchfibn";
import clsx from "clsx";
type ButtonBackgroundImageProps = {
  additionalClassNames?: string;
};

function ButtonBackgroundImage({ children, additionalClassNames = "" }: React.PropsWithChildren<ButtonBackgroundImageProps>) {
  return (
    <div className={clsx("absolute bg-white h-[307.2px] rounded-[16px]", additionalClassNames)}>
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

function BackgroundImage5({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="h-[24px] relative shrink-0 w-full">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] text-nowrap top-[-2.2px]">{children}</p>
    </div>
  );
}
type BackgroundImage4Props = {
  additionalClassNames?: string;
};

function BackgroundImage4({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage4Props>) {
  return (
    <div className={additionalClassNames}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">{children}</div>
    </div>
  );
}
type BackgroundImage3Props = {
  additionalClassNames?: string;
};

function BackgroundImage3({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage3Props>) {
  return <BackgroundImage4 additionalClassNames={clsx("relative shrink-0", additionalClassNames)}>{children}</BackgroundImage4>;
}
type BackgroundImage2Props = {
  additionalClassNames?: string;
};

function BackgroundImage2({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage2Props>) {
  return (
    <div className={clsx("size-[20px]", additionalClassNames)}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        {children}
      </svg>
    </div>
  );
}

function ContainerBackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="h-[144px] relative shrink-0 w-full">
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start pb-0 pt-[16px] px-[16px] relative size-full">{children}</div>
      </div>
    </div>
  );
}

function BackgroundImage1({ children }: React.PropsWithChildren<{}>) {
  return (
    <BackgroundImage2 additionalClassNames="relative shrink-0">
      <g id="Icon">{children}</g>
    </BackgroundImage2>
  );
}
type BackgroundImageProps = {
  additionalClassNames?: string;
};

function BackgroundImage({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImageProps>) {
  return (
    <div className={clsx("size-[16px]", additionalClassNames)}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">{children}</g>
      </svg>
    </div>
  );
}

function IconBackgroundImage3() {
  return (
    <BackgroundImage additionalClassNames="relative shrink-0">
      <path d={svgPaths.pb3a1300} fill="var(--fill-0, #FFB900)" id="Vector" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
    </BackgroundImage>
  );
}
type TextBackgroundImageAndText5Props = {
  text: string;
};

function TextBackgroundImageAndText5({ text }: TextBackgroundImageAndText5Props) {
  return (
    <BackgroundImage3 additionalClassNames="h-[20px] w-[66.75px]">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#6a7282] text-[14px] text-nowrap top-[-1.2px]">{text}</p>
    </BackgroundImage3>
  );
}
type TextBackgroundImageAndText4Props = {
  text: string;
};

function TextBackgroundImageAndText4({ text }: TextBackgroundImageAndText4Props) {
  return (
    <BackgroundImage3 additionalClassNames="h-[24px] w-[36.825px]">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#be9d80] text-[16px] top-[-2.2px] w-[37px]">{text}</p>
    </BackgroundImage3>
  );
}
type TextBackgroundImageAndText3Props = {
  text: string;
};

function TextBackgroundImageAndText3({ text }: TextBackgroundImageAndText3Props) {
  return (
    <BackgroundImage3 additionalClassNames="h-[20px] w-[5.688px]">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#99a1af] text-[14px] text-nowrap top-[-1.2px]">{text}</p>
    </BackgroundImage3>
  );
}

function IconBackgroundImage2() {
  return (
    <BackgroundImage additionalClassNames="relative shrink-0">
      <path d={svgPaths.p1cb7cc00} fill="var(--fill-0, #FFB900)" id="Vector" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
    </BackgroundImage>
  );
}

function IconBackgroundImage1() {
  return (
    <BackgroundImage additionalClassNames="relative shrink-0">
      <path d={svgPaths.p14548f00} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
      <path d={svgPaths.p17781bc0} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
    </BackgroundImage>
  );
}
type HeadingBackgroundImageAndTextProps = {
  text: string;
};

function HeadingBackgroundImageAndText({ text }: HeadingBackgroundImageAndTextProps) {
  return <BackgroundImage5>{text}</BackgroundImage5>;
}
type BackgroundImageAndText1Props = {
  text: string;
};

function BackgroundImageAndText1({ text }: BackgroundImageAndText1Props) {
  return (
    <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[-1.2px]">{text}</p>
    </div>
  );
}
type BackgroundImageAndTextProps = {
  text: string;
};

function BackgroundImageAndText({ text }: BackgroundImageAndTextProps) {
  return (
    <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[28px] left-0 not-italic text-[#101828] text-[18px] text-nowrap top-[-1.4px]">{text}</p>
    </div>
  );
}
type TextBackgroundImageAndText2Props = {
  text: string;
  additionalClassNames?: string;
};

function TextBackgroundImageAndText2({ text, additionalClassNames = "" }: TextBackgroundImageAndText2Props) {
  return (
    <BackgroundImage4 additionalClassNames={clsx("h-[20px] relative shrink-0", additionalClassNames)}>
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#364153] text-[14px] text-nowrap top-[-1.2px]">{text}</p>
    </BackgroundImage4>
  );
}
type TextBackgroundImageAndText1Props = {
  text: string;
};

function TextBackgroundImageAndText1({ text }: TextBackgroundImageAndText1Props) {
  return (
    <BackgroundImage3 additionalClassNames="h-[28px] w-[24.725px]">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[28px] left-0 not-italic text-[#2c1810] text-[18px] text-nowrap top-[-1.4px]">{text}</p>
    </BackgroundImage3>
  );
}
type TextBackgroundImageAndTextProps = {
  text: string;
  additionalClassNames?: string;
};

function TextBackgroundImageAndText({ text, additionalClassNames = "" }: TextBackgroundImageAndTextProps) {
  return (
    <BackgroundImage4 additionalClassNames={clsx("h-[20px] relative shrink-0", additionalClassNames)}>
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[20px] left-0 not-italic text-[#1e2939] text-[14px] text-nowrap top-[-1.2px]">{text}</p>
    </BackgroundImage4>
  );
}

function IconBackgroundImage() {
  return (
    <BackgroundImage1>
      <path d={svgPaths.p32ddfd00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
    </BackgroundImage1>
  );
}

function Container() {
  return <div className="bg-[#00c950] h-[2px] shrink-0 w-[80px]" data-name="Container" />;
}

export default function Caffelino() {
  return (
    <div className="relative size-full" data-name="caffelino">
      <div className="absolute h-[1467.2px] left-0 top-0 w-[1159.2px]" data-name="CafeSelectionCreate" style={{ backgroundImage: "linear-gradient(241.711deg, rgb(139, 89, 67) 2.21%, rgb(217, 191, 157) 33.909%, rgb(139, 89, 67) 76.293%)" }}>
        <div className="absolute content-stretch flex gap-[12px] h-[40px] items-center justify-center left-[91.6px] pl-0 pr-[0.012px] py-0 top-[92.8px] w-[976px]" data-name="Container">
          <ContainerBackgroundImage2 additionalClassNames="w-[95.2px]">
            <ContainerBackgroundImage1 additionalClassNames="bg-[#00c950]">
              <IconBackgroundImage />
            </ContainerBackgroundImage1>
            <TextBackgroundImageAndText text="Details" additionalClassNames="w-[43.2px]" />
          </ContainerBackgroundImage2>
          <Container />
          <ContainerBackgroundImage2 additionalClassNames="w-[84.938px]">
            <div className="basis-0 bg-[#00c950] grow h-[40px] min-h-px min-w-px relative rounded-[2.68435e+07px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0" data-name="Container">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                <IconBackgroundImage />
              </div>
            </div>
            <TextBackgroundImageAndText text="Code" additionalClassNames="w-[32.938px]" />
          </ContainerBackgroundImage2>
          <Container />
          <ContainerBackgroundImage2 additionalClassNames="w-[80.275px]">
            <ContainerBackgroundImage1 additionalClassNames="bg-[#be9d80]">
              <p className="font-['Arial:Bold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-nowrap text-white">3</p>
            </ContainerBackgroundImage1>
            <TextBackgroundImageAndText text="Café" additionalClassNames="w-[28.275px]" />
          </ContainerBackgroundImage2>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[24px] h-[1206.4px] items-start left-[67.6px] px-[24px] py-0 top-[164.8px] w-[1024px]" data-name="Container">
          <div className="bg-gradient-to-b from-[#f5ebe0] h-[206.4px] relative rounded-[16px] shrink-0 to-[#e3d5ca] w-full" data-name="Container">
            <div aria-hidden="true" className="absolute border-[#be9d80] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[16px]" />
            <div className="size-full">
              <div className="content-stretch flex flex-col gap-[16px] items-start pb-[0.8px] pt-[24.8px] px-[24.8px] relative size-full">
                <div className="content-stretch flex h-[52px] items-center justify-between relative shrink-0 w-full" data-name="Container">
                  <div className="h-[52px] relative shrink-0 w-[253.575px]" data-name="Container">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
                      <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 3">
                        <BackgroundImage2 additionalClassNames="absolute left-0 top-[4px]">
                          <g clipPath="url(#clip0_587_634)" id="Icon">
                            <path d={svgPaths.p1c138700} id="Vector" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                            <path d="M16.6667 1.66667V5" id="Vector_2" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                            <path d="M18.3333 3.33333H15" id="Vector_3" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                            <path d={svgPaths.p2661f400} id="Vector_4" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          </g>
                          <defs>
                            <clipPath id="clip0_587_634">
                              <rect fill="white" height="20" width="20" />
                            </clipPath>
                          </defs>
                        </BackgroundImage2>
                        <p className="absolute font-['Arial:Bold',sans-serif] leading-[28px] left-[28px] not-italic text-[#101828] text-[18px] top-[-1.4px] w-[226px]">{`cvgbhnjk@sdfgh's Meetup`}</p>
                      </div>
                      <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
                        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#364153] text-[14px] top-[-1.2px] w-[143px]">Tue, Dec 30 • 11:57 PM</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white h-[40px] relative rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0 w-[89.588px]" data-name="Container">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-0 pt-[8px] px-[16px] relative size-full">
                      <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
                        <p className="absolute font-['Consolas:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#be9d80] text-[16px] text-nowrap top-[-0.6px] tracking-[0.8px]">BJPWYR</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[12px] h-[88.8px] items-start pb-0 pt-[16.8px] px-0 relative shrink-0 w-full" data-name="Container">
                  <div aria-hidden="true" className="absolute border-[0.8px_0px_0px] border-[rgba(190,157,128,0.3)] border-solid inset-0 pointer-events-none" />
                  <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
                    <BackgroundImage additionalClassNames="absolute left-0 top-[2px]">
                      <path d={svgPaths.p32887f80} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                      <path d={svgPaths.p2eaba260} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                      <path d={svgPaths.p9825b00} id="Vector_3" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                      <path d={svgPaths.p3694d280} id="Vector_4" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    </BackgroundImage>
                    <p className="absolute font-['Arial:Bold',sans-serif] leading-[20px] left-[24px] not-italic text-[#364153] text-[14px] top-[-1.2px] w-[82px]">Members (4)</p>
                  </div>
                  <div className="h-[40px] relative shrink-0 w-full" data-name="Container">
                    <div className="absolute bg-white content-stretch flex gap-[8px] h-[40px] items-center left-0 pl-[12px] pr-0 py-0 rounded-[2.68435e+07px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-0 w-[84.238px]" data-name="Container">
                      <TextBackgroundImageAndText1 text="👨" />
                      <TextBackgroundImageAndText2 text="Alex" additionalClassNames="w-[27.513px]" />
                    </div>
                    <div className="absolute bg-white content-stretch flex gap-[8px] h-[40px] items-center left-[92.24px] pl-[12px] pr-0 py-0 rounded-[2.68435e+07px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-0 w-[92.3px]" data-name="Container">
                      <TextBackgroundImageAndText1 text="👩" />
                      <TextBackgroundImageAndText2 text="Sarah" additionalClassNames="w-[35.575px]" />
                    </div>
                    <div className="absolute bg-white content-stretch flex gap-[8px] h-[40px] items-center left-[192.54px] pl-[12px] pr-0 py-0 rounded-[2.68435e+07px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-0 w-[87.875px]" data-name="Container">
                      <TextBackgroundImageAndText1 text="👨‍💼" />
                      <TextBackgroundImageAndText2 text="Mike" additionalClassNames="w-[31.15px]" />
                    </div>
                    <div className="absolute bg-white content-stretch flex gap-[8px] h-[40px] items-center left-[288.41px] pl-[12px] pr-0 py-0 rounded-[2.68435e+07px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-0 w-[96.088px]" data-name="Container">
                      <TextBackgroundImageAndText1 text="👩‍💻" />
                      <TextBackgroundImageAndText2 text="Emma" additionalClassNames="w-[39.362px]" />
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
                  <div className="absolute content-stretch flex flex-col gap-[4px] h-[52px] items-start left-0 top-0 w-[213.65px]" data-name="Container">
                    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 3">
                      <p className="absolute font-['Arial:Bold',sans-serif] leading-[28px] left-0 not-italic text-[#101828] text-[18px] text-nowrap top-[-1.4px]">Enable Voting</p>
                    </div>
                    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
                      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[-1.2px]">Select 3 cafés for members to vote</p>
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
            <div className="absolute h-[59.2px] left-0 rounded-[16px] top-0 w-[976px]" data-name="Text Input">
              <div className="content-stretch flex items-center overflow-clip px-[48px] py-[16px] relative rounded-[inherit] size-full">
                <p className="font-['Arial:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1e1e1e] text-[16px] text-nowrap">Search cafés by name or area</p>
              </div>
              <div aria-hidden="true" className="absolute border-[#1e1e1e] border-[1.6px] border-solid inset-0 pointer-events-none rounded-[16px]" />
            </div>
            <div className="absolute content-stretch flex h-[59.2px] items-center left-0 pl-[16px] pr-0 py-0 top-0 w-[36px]" data-name="Container">
              <BackgroundImage1>
                <path d="M17.5 17.5L13.8833 13.8833" id="Vector" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                <path d={svgPaths.pcddfd00} id="Vector_2" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
              </BackgroundImage1>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[16px] h-[674.4px] items-start relative shrink-0 w-full" data-name="Container">
            <div className="content-stretch flex h-[28px] items-center justify-between relative shrink-0 w-full" data-name="Container">
              <div className="h-[28px] relative shrink-0 w-[116.088px]" data-name="Heading 3">
                <BackgroundImageAndText text="Select 3 Cafés" />
              </div>
              <BackgroundImage3 additionalClassNames="h-[20px] w-[82.813px]">
                <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-1.2px] w-[83px]">0 / 3 selected</p>
              </BackgroundImage3>
            </div>
            <div className="h-[630.4px] relative shrink-0 w-full" data-name="Container">
              <ButtonBackgroundImage additionalClassNames="left-0 top-0 w-[314.663px]">
                <div className="content-stretch flex flex-col h-[160px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
                  <div className="h-[160px] shrink-0 w-full" data-name="Image (Café Mocha)" />
                </div>
                <ContainerBackgroundImage>
                  <HeadingBackgroundImageAndText text="Café Mocha" />
                  <div className="content-stretch flex flex-col gap-[8px] h-[80px] items-start relative shrink-0 w-full" data-name="Container">
                    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
                      <IconBackgroundImage1 />
                      <div className="h-[20px] relative shrink-0 w-[80.963px]" data-name="Text">
                        <BackgroundImageAndText1 text="Koramangala" />
                      </div>
                    </div>
                    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
                      <IconBackgroundImage2 />
                      <div className="h-[20px] relative shrink-0 w-[19.225px]" data-name="Text">
                        <BackgroundImageAndText1 text="4.5" />
                      </div>
                      <TextBackgroundImageAndText3 text="•" />
                      <BackgroundImage3 additionalClassNames="h-[20px] w-[85.438px]">
                        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[-1.2px]">{`Cozy & Warm`}</p>
                      </BackgroundImage3>
                    </div>
                    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
                      <TextBackgroundImageAndText4 text="₹250" />
                      <TextBackgroundImageAndText5 text="per person" />
                    </div>
                  </div>
                </ContainerBackgroundImage>
              </ButtonBackgroundImage>
              <ButtonBackgroundImage additionalClassNames="left-[330.66px] top-0 w-[314.663px]">
                <div className="content-stretch flex flex-col h-[160px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
                  <div className="h-[160px] shrink-0 w-full" data-name="Image (The Coffee Bean)" />
                </div>
                <ContainerBackgroundImage>
                  <HeadingBackgroundImageAndText text="The Coffee Bean" />
                  <div className="content-stretch flex flex-col gap-[8px] h-[80px] items-start relative shrink-0 w-full" data-name="Container">
                    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
                      <IconBackgroundImage1 />
                      <div className="h-[20px] relative shrink-0 w-[70.563px]" data-name="Text">
                        <BackgroundImageAndText1 text="Indiranagar" />
                      </div>
                    </div>
                    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
                      <IconBackgroundImage2 />
                      <div className="h-[20px] relative shrink-0 w-[19.225px]" data-name="Text">
                        <BackgroundImageAndText1 text="4.3" />
                      </div>
                      <TextBackgroundImageAndText3 text="•" />
                      <div className="h-[20px] relative shrink-0 w-[63.925px]" data-name="Text">
                        <BackgroundImageAndText1 text="Minimalist" />
                      </div>
                    </div>
                    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
                      <TextBackgroundImageAndText4 text="₹180" />
                      <TextBackgroundImageAndText5 text="per person" />
                    </div>
                  </div>
                </ContainerBackgroundImage>
              </ButtonBackgroundImage>
              <ButtonBackgroundImage additionalClassNames="left-[661.33px] top-0 w-[314.675px]">
                <div className="content-stretch flex flex-col h-[160px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
                  <div className="h-[160px] shrink-0 w-full" data-name="Image (Brew & Bites)" />
                </div>
                <ContainerBackgroundImage>
                  <BackgroundImage5>{`Brew & Bites`}</BackgroundImage5>
                  <div className="content-stretch flex flex-col gap-[8px] h-[80px] items-start relative shrink-0 w-full" data-name="Container">
                    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
                      <IconBackgroundImage1 />
                      <div className="h-[20px] relative shrink-0 w-[70.95px]" data-name="Text">
                        <BackgroundImageAndText1 text="HSR Layout" />
                      </div>
                    </div>
                    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
                      <IconBackgroundImage3 />
                      <div className="h-[20px] relative shrink-0 w-[18.95px]" data-name="Text">
                        <BackgroundImageAndText1 text="4.7" />
                      </div>
                      <TextBackgroundImageAndText3 text="•" />
                      <div className="h-[20px] relative shrink-0 w-[55.463px]" data-name="Text">
                        <BackgroundImageAndText1 text="Premium" />
                      </div>
                    </div>
                    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
                      <TextBackgroundImageAndText4 text="₹300" />
                      <TextBackgroundImageAndText5 text="per person" />
                    </div>
                  </div>
                </ContainerBackgroundImage>
              </ButtonBackgroundImage>
              <ButtonBackgroundImage additionalClassNames="left-0 top-[323.2px] w-[314.663px]">
                <div className="content-stretch flex flex-col h-[160px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
                  <div className="h-[160px] shrink-0 w-full" data-name="Image (Urban Grind)" />
                </div>
                <ContainerBackgroundImage>
                  <HeadingBackgroundImageAndText text="Urban Grind" />
                  <div className="content-stretch flex flex-col gap-[8px] h-[80px] items-start relative shrink-0 w-full" data-name="Container">
                    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
                      <IconBackgroundImage1 />
                      <div className="h-[20px] relative shrink-0 w-[63.188px]" data-name="Text">
                        <BackgroundImageAndText1 text="Whitefield" />
                      </div>
                    </div>
                    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
                      <IconBackgroundImage2 />
                      <div className="h-[20px] relative shrink-0 w-[19.513px]" data-name="Text">
                        <BackgroundImageAndText1 text="4.4" />
                      </div>
                      <TextBackgroundImageAndText3 text="•" />
                      <div className="h-[20px] relative shrink-0 w-[49.138px]" data-name="Text">
                        <BackgroundImageAndText1 text="Modern" />
                      </div>
                    </div>
                    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
                      <TextBackgroundImageAndText4 text="₹220" />
                      <TextBackgroundImageAndText5 text="per person" />
                    </div>
                  </div>
                </ContainerBackgroundImage>
              </ButtonBackgroundImage>
              <ButtonBackgroundImage additionalClassNames="left-[330.66px] top-[323.2px] w-[314.663px]">
                <div className="content-stretch flex flex-col h-[160px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
                  <div className="h-[160px] shrink-0 w-full" data-name="Image (Espresso House)" />
                </div>
                <ContainerBackgroundImage>
                  <HeadingBackgroundImageAndText text="Espresso House" />
                  <div className="content-stretch flex flex-col gap-[8px] h-[80px] items-start relative shrink-0 w-full" data-name="Container">
                    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
                      <IconBackgroundImage1 />
                      <div className="h-[20px] relative shrink-0 w-[57.55px]" data-name="Text">
                        <BackgroundImageAndText1 text="MG Road" />
                      </div>
                    </div>
                    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
                      <IconBackgroundImage2 />
                      <div className="h-[20px] relative shrink-0 w-[19.263px]" data-name="Text">
                        <BackgroundImageAndText1 text="4.6" />
                      </div>
                      <TextBackgroundImageAndText3 text="•" />
                      <div className="h-[20px] relative shrink-0 w-[40.925px]" data-name="Text">
                        <BackgroundImageAndText1 text="Classic" />
                      </div>
                    </div>
                    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
                      <TextBackgroundImageAndText4 text="₹200" />
                      <TextBackgroundImageAndText5 text="per person" />
                    </div>
                  </div>
                </ContainerBackgroundImage>
              </ButtonBackgroundImage>
              <ButtonBackgroundImage additionalClassNames="left-[661.33px] top-[323.2px] w-[314.675px]">
                <div className="content-stretch flex flex-col h-[160px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
                  <div className="h-[160px] shrink-0 w-full" data-name="Image (Chai & Chatter)" />
                </div>
                <ContainerBackgroundImage>
                  <BackgroundImage5>{`Chai & Chatter`}</BackgroundImage5>
                  <div className="content-stretch flex flex-col gap-[8px] h-[80px] items-start relative shrink-0 w-full" data-name="Container">
                    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
                      <IconBackgroundImage1 />
                      <div className="h-[20px] relative shrink-0 w-[61.3px]" data-name="Text">
                        <BackgroundImageAndText1 text="Jayanagar" />
                      </div>
                    </div>
                    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
                      <IconBackgroundImage3 />
                      <div className="h-[20px] relative shrink-0 w-[19.225px]" data-name="Text">
                        <BackgroundImageAndText1 text="4.2" />
                      </div>
                      <TextBackgroundImageAndText3 text="•" />
                      <div className="h-[20px] relative shrink-0 w-[40.175px]" data-name="Text">
                        <BackgroundImageAndText1 text="Casual" />
                      </div>
                    </div>
                    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
                      <TextBackgroundImageAndText4 text="₹150" />
                      <TextBackgroundImageAndText5 text="per person" />
                    </div>
                  </div>
                </ContainerBackgroundImage>
              </ButtonBackgroundImage>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bg-white content-stretch flex flex-col h-[68.8px] items-start left-[67.6px] pb-0 pt-[16.8px] px-[24px] top-[658.4px] w-[1024px]" data-name="CafeSelectionCreate">
        <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.8px_0px_0px] border-solid inset-0 pointer-events-none" />
        <div className="bg-[#be9d80] h-[36px] opacity-50 relative rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Button">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex gap-[8px] items-center justify-center pl-0 pr-[0.012px] py-0 relative size-full">
              <BackgroundImage3 additionalClassNames="h-[24px] w-[113.713px]">
                <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-[57px] not-italic text-[#1e1e1e] text-[16px] text-center text-nowrap top-[-2.2px] translate-x-[-50%]">Send for Voting</p>
              </BackgroundImage3>
              <BackgroundImage additionalClassNames="relative shrink-0">
                <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                <path d={svgPaths.p1d405500} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
              </BackgroundImage>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bg-white content-stretch flex flex-col h-[60.8px] items-start left-0 pb-[0.8px] pt-0 px-[67.6px] top-0 w-[1159.2px]" data-name="CafeSelectionCreate">
        <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0px_0px_0.8px] border-solid inset-0 pointer-events-none" />
        <div className="h-[60px] relative shrink-0 w-full" data-name="Container">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex items-center justify-between px-[24px] py-0 relative size-full">
              <div className="h-[24px] relative shrink-0 w-[52.15px]" data-name="Button">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
                  <p className="font-['Arial:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#364153] text-[16px] text-center text-nowrap">← Back</p>
                </div>
              </div>
              <div className="h-[28px] relative shrink-0 w-[120.85px]" data-name="Container">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
                  <BackgroundImage1>
                    <path d="M8.33333 1.66667V3.33333" id="Vector" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d="M11.6667 1.66667V3.33333" id="Vector_2" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d={svgPaths.p257a4f00} id="Vector_3" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d="M5 1.66667V3.33333" id="Vector_4" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  </BackgroundImage1>
                  <div className="basis-0 grow h-[28px] min-h-px min-w-px relative shrink-0" data-name="Heading 1">
                    <BackgroundImageAndText text="Select Café" />
                  </div>
                </div>
              </div>
              <div className="h-0 shrink-0 w-[80px]" data-name="Container" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}