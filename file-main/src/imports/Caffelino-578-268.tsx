import svgPaths from "./svg-38xmpq1ycz";
import clsx from "clsx";
type ContainerBackgroundImageProps = {
  additionalClassNames?: string;
};

function ContainerBackgroundImage({ children, additionalClassNames = "" }: React.PropsWithChildren<ContainerBackgroundImageProps>) {
  return (
    <div className={clsx("h-[40px] relative shrink-0", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">{children}</div>
    </div>
  );
}
type BackgroundImage2Props = {
  additionalClassNames?: string;
};

function BackgroundImage2({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage2Props>) {
  return (
    <div className={additionalClassNames}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">{children}</div>
    </div>
  );
}
type BackgroundImage1Props = {
  additionalClassNames?: string;
};

function BackgroundImage1({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage1Props>) {
  return <BackgroundImage2 additionalClassNames={clsx("relative shrink-0", additionalClassNames)}>{children}</BackgroundImage2>;
}

function BackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[20px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        {children}
      </svg>
    </div>
  );
}

function IconBackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <BackgroundImage>
      <g id="Icon">{children}</g>
    </BackgroundImage>
  );
}
type LabelBackgroundImageAndTextProps = {
  text: string;
};

function LabelBackgroundImageAndText({ text }: LabelBackgroundImageAndTextProps) {
  return (
    <div className="h-[20px] relative shrink-0 w-full">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[20px] left-0 not-italic text-[#101828] text-[14px] text-nowrap top-[-1.2px]">{text}</p>
    </div>
  );
}
type TextBackgroundImageAndTextProps = {
  text: string;
  additionalClassNames?: string;
};

function TextBackgroundImageAndText({ text, additionalClassNames = "" }: TextBackgroundImageAndTextProps) {
  return (
    <BackgroundImage2 additionalClassNames={clsx("h-[20px] relative shrink-0", additionalClassNames)}>
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#99a1af] text-[14px] text-nowrap top-[-1.2px]">{text}</p>
    </BackgroundImage2>
  );
}
type ContainerBackgroundImageAndTextProps = {
  text: string;
};

function ContainerBackgroundImageAndText({ text }: ContainerBackgroundImageAndTextProps) {
  return (
    <div className="basis-0 bg-[#e5e7eb] grow h-[40px] min-h-px min-w-px relative rounded-[2.68435e+07px] shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Arial:Bold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#99a1af] text-[16px] text-nowrap">{text}</p>
      </div>
    </div>
  );
}

function Container() {
  return <div className="bg-[#d1d5dc] h-[2px] shrink-0 w-[80px]" data-name="Container" />;
}

export default function Caffelino() {
  return (
    <div className="bg-[#fffbf5] relative size-full" data-name="caffelino">
      <div className="absolute bg-white h-[940px] left-0 top-[-100.8px] w-[1159.2px]" data-name="AdminDetails">
        <div className="absolute content-stretch flex gap-[12px] h-[40px] items-center justify-center left-[155.6px] pl-0 pr-[0.012px] py-0 top-[92.8px] w-[848px]" data-name="Container">
          <ContainerBackgroundImage additionalClassNames="w-[95.2px]">
            <div className="bg-[#be9d80] relative rounded-[2.68435e+07px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0 size-[40px]" data-name="Container">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                <p className="font-['Arial:Bold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-nowrap text-white">1</p>
              </div>
            </div>
            <BackgroundImage1 additionalClassNames="h-[20px] w-[43.2px]">
              <p className="absolute font-['Arial:Bold',sans-serif] leading-[20px] left-0 not-italic text-[#1e2939] text-[14px] text-nowrap top-[-1.2px]">Details</p>
            </BackgroundImage1>
          </ContainerBackgroundImage>
          <Container />
          <ContainerBackgroundImage additionalClassNames="w-[84.438px]">
            <ContainerBackgroundImageAndText text="2" />
            <TextBackgroundImageAndText text="Code" additionalClassNames="w-[32.438px]" />
          </ContainerBackgroundImage>
          <Container />
          <ContainerBackgroundImage additionalClassNames="w-[79.5px]">
            <ContainerBackgroundImageAndText text="3" />
            <TextBackgroundImageAndText text="Café" additionalClassNames="w-[27.5px]" />
          </ContainerBackgroundImage>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[40px] h-[775.2px] items-start left-[243.6px] px-[24px] py-0 top-[164.8px] w-[672px]" data-name="Container">
          <div className="h-[180px] relative shrink-0 w-full" data-name="Container">
            <div className="absolute bg-gradient-to-b from-[#be9d80] left-[272px] rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[80px] to-[#a88968] top-0" data-name="Container">
              <div className="absolute left-[20px] size-[40px] top-[20px]" data-name="Icon">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
                  <g id="Icon">
                    <path d={svgPaths.p75adf00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
                    <path d="M33.3333 3.33333V10" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
                    <path d="M36.6667 6.66667H30" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
                    <path d={svgPaths.p96f6a80} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
                  </g>
                </svg>
              </div>
            </div>
            <div className="absolute h-[36px] left-0 top-[104px] w-[624px]" data-name="Heading 2">
              <p className="absolute font-['Arial:Bold',sans-serif] leading-[36px] left-[312.06px] not-italic text-[#101828] text-[30px] text-center text-nowrap top-[-2.6px] translate-x-[-50%]">Create a Café Meetup</p>
            </div>
            <div className="absolute h-[28px] left-0 top-[152px] w-[624px]" data-name="Paragraph">
              <p className="absolute font-['Arial:Regular',sans-serif] leading-[28px] left-[312px] not-italic text-[#101828] text-[18px] text-center text-nowrap top-[-1.4px] translate-x-[-50%]">Plan, choose a café, order together, and split bills seamlessly</p>
            </div>
          </div>
          <div className="h-[431.2px] relative rounded-[16px] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(55.1783deg, rgb(139, 89, 67) 0.97833%, rgb(217, 191, 157) 51.928%, rgb(139, 89, 67) 99.105%)" }}>
            <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
            <div className="size-full">
              <div className="content-stretch flex flex-col gap-[32px] items-start pb-[0.8px] pt-[32.8px] px-[32.8px] relative size-full">
                <div className="content-stretch flex flex-col gap-[24px] h-[297.6px] items-start relative shrink-0 w-full" data-name="Container">
                  <div className="content-stretch flex flex-col gap-[8px] h-[83.2px] items-start relative shrink-0 w-full" data-name="Container">
                    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
                      <p className="absolute font-['Arial:Bold',sans-serif] leading-[20px] left-0 not-italic text-[#364153] text-[14px] text-nowrap top-[-1.2px]">Organizer Name</p>
                    </div>
                    <div className="h-[55.2px] relative shrink-0 w-full" data-name="Container">
                      <div className="absolute h-[55.2px] left-0 rounded-[16px] top-0 w-[558.4px]" data-name="Text Input">
                        <div className="content-stretch flex items-center overflow-clip pl-[48px] pr-[16px] py-[14px] relative rounded-[inherit] size-full">
                          <p className="font-['Arial:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#101828] text-[16px] text-nowrap">nnn</p>
                        </div>
                        <div aria-hidden="true" className="absolute border-[#101828] border-[1.6px] border-solid inset-0 pointer-events-none rounded-[16px]" />
                      </div>
                      <div className="absolute content-stretch flex h-[55.2px] items-center left-0 pl-[16px] pr-0 py-0 top-0 w-[36px]" data-name="Container">
                        <IconBackgroundImage>
                          <path d={svgPaths.p1beb9580} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d={svgPaths.p32ab0300} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        </IconBackgroundImage>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex flex-col gap-[8px] h-[83.2px] items-start relative shrink-0 w-full" data-name="Container">
                    <LabelBackgroundImageAndText text="Meetup Date" />
                    <div className="h-[55.2px] relative shrink-0 w-full" data-name="Container">
                      <div className="absolute border-[#1e1e1e] border-[1.6px] border-solid h-[55.2px] left-0 rounded-[16px] top-0 w-[558.4px]" data-name="Date Picker" />
                      <div className="absolute content-stretch flex h-[55.2px] items-center left-0 pl-[16px] pr-0 py-0 top-0 w-[36px]" data-name="Container">
                        <IconBackgroundImage>
                          <path d="M6.66667 1.66667V5" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d="M13.3333 1.66667V5" id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d={svgPaths.p1da67b80} id="Vector_3" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d="M2.5 8.33333H17.5" id="Vector_4" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        </IconBackgroundImage>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex flex-col gap-[8px] h-[83.2px] items-start relative shrink-0 w-full" data-name="Container">
                    <LabelBackgroundImageAndText text="Meetup Time" />
                    <div className="h-[55.2px] relative shrink-0 w-full" data-name="Container">
                      <div className="absolute border-[#1e1e1e] border-[1.6px] border-solid h-[55.2px] left-0 rounded-[16px] top-0 w-[558.4px]" data-name="Time Picker" />
                      <div className="absolute content-stretch flex h-[55.2px] items-center left-0 pl-[16px] pr-0 py-0 top-0 w-[36px]" data-name="Container">
                        <BackgroundImage>
                          <g clipPath="url(#clip0_578_298)" id="Icon">
                            <path d="M10 5V10L13.3333 11.6667" id="Vector" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                            <path d={svgPaths.p14d24500} id="Vector_2" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          </g>
                          <defs>
                            <clipPath id="clip0_578_298">
                              <rect fill="white" height="20" width="20" />
                            </clipPath>
                          </defs>
                        </BackgroundImage>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#8b5943] h-[36px] relative rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Button">
                  <div className="flex flex-row items-center justify-center size-full">
                    <div className="content-stretch flex gap-[8px] items-center justify-center pl-0 pr-[0.013px] py-0 relative size-full">
                      <BackgroundImage1 additionalClassNames="h-[24px] w-[65.963px]">
                        <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-[33px] not-italic text-[#1e1e1e] text-[16px] text-center text-nowrap top-[-2.2px] translate-x-[-50%]">Continue</p>
                      </BackgroundImage1>
                      <div className="relative shrink-0 size-[16px]" data-name="Icon">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                          <g id="Icon">
                            <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                            <path d={svgPaths.p1d405500} id="Vector_2" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                          </g>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
            <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[311.51px] not-italic text-[#6a7282] text-[14px] text-center text-nowrap top-[-1.2px] translate-x-[-50%]">All fields are required to create your meetup</p>
          </div>
        </div>
      </div>
      <div className="absolute bg-white content-stretch flex flex-col h-[60.8px] items-start left-0 pb-[0.8px] pt-0 px-[131.6px] top-0 w-[1159.2px]" data-name="AdminDetails">
        <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0px_0px_0.8px] border-solid inset-0 pointer-events-none" />
        <div className="h-[60px] relative shrink-0 w-full" data-name="Container">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex items-center justify-between px-[24px] py-0 relative size-full">
              <div className="h-[24px] relative shrink-0 w-[52.15px]" data-name="Button">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
                  <p className="font-['Arial:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#364153] text-[16px] text-center text-nowrap">← Back</p>
                </div>
              </div>
              <div className="h-[28px] relative shrink-0 w-[153.15px]" data-name="Container">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
                  <IconBackgroundImage>
                    <path d="M8.33333 1.66667V3.33333" id="Vector" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d="M11.6667 1.66667V3.33333" id="Vector_2" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d={svgPaths.p257a4f00} id="Vector_3" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d="M5 1.66667V3.33333" id="Vector_4" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  </IconBackgroundImage>
                  <BackgroundImage1 additionalClassNames="h-[28px] w-[125.15px]">
                    <p className="absolute font-['Arial:Bold',sans-serif] leading-[28px] left-0 not-italic text-[#101828] text-[18px] text-nowrap top-[-1.4px]">Create Meetup</p>
                  </BackgroundImage1>
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