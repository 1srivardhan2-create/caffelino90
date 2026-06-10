import svgPaths from "./svg-j9evwrknpl";
import clsx from "clsx";
const imgImageProfileAvatar = "/profileAvatar.png";
const imgMylogo1 = "/mylogo1.png";
type ContainerBackgroundImage2Props = {
  additionalClassNames?: string;
};

function ContainerBackgroundImage2({ children, additionalClassNames = "" }: React.PropsWithChildren<ContainerBackgroundImage2Props>) {
  return (
    <div style={{ backgroundImage: "linear-gradient(152.542deg, rgba(139, 89, 67, 0.2) 0%, rgba(217, 191, 157, 0.2) 100%)" }} className={clsx("absolute content-stretch flex flex-col gap-[16px] h-[180px] items-center px-0 py-[24px] rounded-[16px] top-0 w-[346.4px]", additionalClassNames)}>
      {children}
    </div>
  );
}
type ContainerBackgroundImage1Props = {
  additionalClassNames?: string;
};

function ContainerBackgroundImage1({ children, additionalClassNames = "" }: React.PropsWithChildren<ContainerBackgroundImage1Props>) {
  return (
    <div className={clsx("h-[52px] relative shrink-0", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">{children}</div>
    </div>
  );
}

function BackgroundImage2({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="basis-0 bg-[#8b5943] grow min-h-px min-w-px relative rounded-[2.68435e+07px] shrink-0 w-[64px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">{children}</div>
    </div>
  );
}

function ContainerBackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="bg-[rgba(139,89,67,0.2)] relative rounded-[2.68435e+07px] shrink-0 size-[48px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">{children}</div>
    </div>
  );
}
type IconBackgroundImage2Props = {
  additionalClassNames?: string;
};

function IconBackgroundImage2({ children, additionalClassNames = "" }: React.PropsWithChildren<IconBackgroundImage2Props>) {
  return (
    <div className={clsx("absolute size-[20px] top-[18px]", additionalClassNames)}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        {children}
      </svg>
    </div>
  );
}

function BackgroundImage1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="h-[24px] relative shrink-0 w-full">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#0a0a0a] text-[18px] text-nowrap top-[0.6px]">{children}</p>
    </div>
  );
}

function BackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        {children}
      </svg>
    </div>
  );
}

function IconBackgroundImage1({ children }: React.PropsWithChildren<{}>) {
  return (
    <BackgroundImage>
      <g id="Icon">{children}</g>
    </BackgroundImage>
  );
}

function IconBackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[32px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Icon">{children}</g>
      </svg>
    </div>
  );
}
type ParagraphBackgroundImageAndText1Props = {
  text: string;
};

function ParagraphBackgroundImageAndText1({ text }: ParagraphBackgroundImageAndText1Props) {
  return <BackgroundImage1>{text}</BackgroundImage1>;
}
type ParagraphBackgroundImageAndTextProps = {
  text: string;
};

function ParagraphBackgroundImageAndText({ text }: ParagraphBackgroundImageAndTextProps) {
  return (
    <div className="h-[20px] relative shrink-0 w-full">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#525252] text-[14px] text-nowrap top-[-0.4px]">{text}</p>
    </div>
  );
}
type BackgroundImageAndText1Props = {
  text: string;
  additionalClassNames?: string;
};

function BackgroundImageAndText1({ text, additionalClassNames = "" }: BackgroundImageAndText1Props) {
  return (
    <div className={clsx("bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center py-[8px] relative size-full", additionalClassNames)}>
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-nowrap text-white">{text}</p>
    </div>
  );
}
type HeadingBackgroundImageAndTextProps = {
  text: string;
};

function HeadingBackgroundImageAndText({ text }: HeadingBackgroundImageAndTextProps) {
  return (
    <div className="h-[24px] relative shrink-0 w-full">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-[-2.2px]">{text}</p>
    </div>
  );
}
type BackgroundImageAndTextProps = {
  text: string;
  additionalClassNames?: string;
};

function BackgroundImageAndText({ text, additionalClassNames = "" }: BackgroundImageAndTextProps) {
  return (
    <div className={clsx("absolute h-[21px] left-0", additionalClassNames)}>
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#cad5e2] text-[14px] text-nowrap top-[-1.2px]">{text}</p>
    </div>
  );
}

export default function Caffelino() {
  return (
    <div className="bg-[#fffbf5] relative size-full" data-name="caffelino">
      <div className="absolute bg-[#f8fafc] content-stretch flex flex-col h-[1674.4px] items-start left-0 pb-0 pt-[56px] px-0 top-0 w-[1159.2px]" data-name="AppContent">
        <div className="bg-white h-[1618.4px] overflow-clip relative shrink-0 w-full" data-name="HomePage">
          <div className="absolute bg-[#1a2332] h-[324.8px] left-0 top-[1293.6px] w-[1159.2px]" data-name="Footer">
            <div className="absolute h-[124px] left-[16px] top-[48px] w-[1127.2px]" data-name="Container">
              <div className="absolute h-[124px] left-0 top-0 w-[354.4px]" data-name="Container">
                <div className="absolute h-[27px] left-0 top-0 w-[354.4px]" data-name="Heading 3">
                  <p className="absolute font-['Arial:Regular',sans-serif] leading-[27px] left-0 not-italic text-[18px] text-nowrap text-white top-[-2.2px]">Caffélino</p>
                </div>
                <BackgroundImageAndText text="Connect with real people over real conversations." additionalClassNames="top-[39px] w-[354.4px]" />
                <div className="absolute border-[#45556c] border-[0.8px] border-solid left-0 rounded-[2.68435e+07px] size-[36px] top-[76px]" data-name="Link">
                  <div className="absolute left-[9.2px] size-[16px] top-[9.2px]" data-name="Icon">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                      <g clipPath="url(#clip0_575_459)" id="Icon">
                        <path d={svgPaths.p22916300} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                        <path d={svgPaths.p8d16f00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                        <path d="M11.6667 4.33333H11.6733" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                      </g>
                      <defs>
                        <clipPath id="clip0_575_459">
                          <rect fill="white" height="16" width="16" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="absolute content-stretch flex flex-col gap-[12px] h-[124px] items-start left-[386.4px] top-0 w-[354.4px]" data-name="Container">
                <HeadingBackgroundImageAndText text="Quick Links" />
                <div className="content-stretch flex flex-col gap-[8px] h-[56px] items-start relative shrink-0 w-full" data-name="List">
                  <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
                    <BackgroundImageAndText text="Home" additionalClassNames="top-[2.4px] w-[37.525px]" />
                  </div>
                  <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
                    <BackgroundImageAndText text="Contact Us" additionalClassNames="top-[2.4px] w-[67.275px]" />
                  </div>
                </div>
              </div>
              <div className="absolute content-stretch flex flex-col gap-[12px] h-[124px] items-start left-[772.8px] top-0 w-[354.4px]" data-name="Container">
                <HeadingBackgroundImageAndText text="Legal" />
                <div className="content-stretch flex flex-col gap-[8px] h-[88px] items-start relative shrink-0 w-full" data-name="List">
                  <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
                    <BackgroundImageAndText text="About Us" additionalClassNames="top-[2.4px] w-[57.525px]" />
                  </div>
                  <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
                    <BackgroundImageAndText text="How It Works" additionalClassNames="top-[2.4px] w-[82.9px]" />
                  </div>
                  <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
                    <BackgroundImageAndText text="Safety Guidelines" additionalClassNames="top-[2.4px] w-[106.075px]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bg-white content-stretch flex flex-col h-[72.8px] items-start left-0 pb-0 pt-[16.8px] px-[16px] top-[252px] w-[1159.2px]" data-name="Container">
              <div aria-hidden="true" className="absolute border-[#e2e8f0] border-[0.8px_0px_0px] border-solid inset-0 pointer-events-none" />
              <div className="h-[40px] relative shrink-0 w-full" data-name="Container">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex items-center justify-between relative size-full">
                    <div className="h-[21px] relative shrink-0 w-[242.713px]" data-name="Paragraph">
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#314158] text-[14px] text-nowrap top-[-1.2px]">Join Caffélino to create and join groups</p>
                      </div>
                    </div>
                    <div className="h-[40px] relative shrink-0 w-[198.975px]" data-name="Container">
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
                        <div className="bg-[#be9d80] h-[36px] relative rounded-[8px] shrink-0 w-[146.975px]" data-name="Button">
                          <BackgroundImageAndText1 text="Login / Sign Up" additionalClassNames="px-[24px]" />
                        </div>
                        <div className="relative rounded-[2.68435e+07px] shrink-0 size-[40px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(251, 100, 182) 0%, rgb(194, 122, 255) 100%)" }}>
                          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip relative rounded-[inherit] size-full">
                            <div className="bg-white rounded-[2.68435e+07px] shrink-0 size-[36px]" data-name="Container" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute content-stretch flex flex-col h-[1292.8px] items-start left-0 top-[0.8px] w-[1159.2px]" data-name="Container">
            <div className="h-[420px] relative shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(70.915deg, rgb(139, 89, 67) 2.259%, rgb(217, 191, 157) 50.958%, rgb(139, 89, 67) 99.733%)" }}>
              <div className="flex flex-col justify-center size-full">
                <div className="content-stretch flex flex-col items-start justify-center pl-[24px] pr-0 py-0 relative size-full">
                  <div className="h-[200px] relative shrink-0 w-[1111.2px]" data-name="Container">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-center relative size-full">
                      <div className="h-[60px] relative shrink-0 w-[1079.2px]" data-name="Paragraph">
                        <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                          <p className="absolute font-['Advent_Pro:Regular',sans-serif] font-normal leading-[60px] left-[539.85px] text-[#4a2c1a] text-[48px] text-center text-nowrap top-[-1.2px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>{`Plan Meetups with Friends & Family`}</p>
                        </div>
                      </div>
                      <div className="h-[28px] relative shrink-0 w-[1079.2px]" data-name="Paragraph">
                        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start px-[8px] py-0 relative size-full">
                          <p className="basis-0 font-['Archivo_Narrow:Regular',sans-serif] font-normal grow leading-[28px] min-h-px min-w-px relative shrink-0 text-[#4a2c1a] text-[20px] text-center">Create Groups. Split Bills. Enjoy Together.</p>
                        </div>
                      </div>
                      <div className="h-[56px] relative shrink-0 w-[1079.2px]" data-name="Container">
                        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center justify-center relative size-full">
                          <div className="bg-[#0a0a0a] h-[56px] relative rounded-[16px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] shrink-0 w-[219.25px]" data-name="Button">
                            <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                              <IconBackgroundImage2 additionalClassNames="left-[40px]">
                                <g clipPath="url(#clip0_575_403)" id="Icon">
                                  <path d={svgPaths.p2061d800} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                                  <path d="M16.6667 1.66667V5" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                                  <path d="M18.3333 3.33333H15" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                                  <path d={svgPaths.p2661f400} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                                </g>
                                <defs>
                                  <clipPath id="clip0_575_403">
                                    <rect fill="white" height="20" width="20" />
                                  </clipPath>
                                </defs>
                              </IconBackgroundImage2>
                              <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-[124.5px] not-italic text-[16px] text-center text-nowrap text-white top-[13.8px] translate-x-[-50%]">Create Meetup</p>
                            </div>
                          </div>
                          <div className="bg-[#0a0a0a] h-[56px] relative rounded-[16px] shrink-0 w-[205.2px]" data-name="Button">
                            <div aria-hidden="true" className="absolute border-[#be9d80] border-[1.6px] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
                            <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                              <IconBackgroundImage2 additionalClassNames="left-[41.6px]">
                                <g id="Icon">
                                  <path d={svgPaths.p25397b80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                                  <path d={svgPaths.p18406864} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                                  <path d={svgPaths.p2241fff0} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                                  <path d={svgPaths.p2c4f400} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                                </g>
                              </IconBackgroundImage2>
                              <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-[116.6px] not-italic text-[#f8fafc] text-[16px] text-center text-nowrap top-[13.8px] translate-x-[-50%]">Join Meetup</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[364px] relative shrink-0 w-full" data-name="Container">
              <div className="absolute h-[40px] left-[28px] top-[48px] w-[1103.2px]" data-name="Paragraph">
                <p className="absolute font-['Arial:Regular',sans-serif] leading-[40px] left-[551.76px] not-italic text-[#0a0a0a] text-[32px] text-center text-nowrap top-[1.4px] translate-x-[-50%]">How It Works</p>
              </div>
              <div className="absolute h-[180px] left-[24px] top-[120px] w-[1111.2px]" data-name="Container">
                <ContainerBackgroundImage2 additionalClassNames="left-[4px]">
                  <BackgroundImage2>
                    <IconBackgroundImage>
                      <path d={svgPaths.p27a3200} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                      <path d={svgPaths.p2db021c0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                      <path d={svgPaths.p18f42980} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                      <path d={svgPaths.p2ee517c0} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                    </IconBackgroundImage>
                  </BackgroundImage2>
                  <ContainerBackgroundImage1 additionalClassNames="w-[284.587px]">
                    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
                      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-[142.74px] not-italic text-[#0a0a0a] text-[18px] text-center text-nowrap top-[0.6px] translate-x-[-50%]">{`1. Sign Up & Create Profile`}</p>
                    </div>
                    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
                      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[142.5px] not-italic text-[#525252] text-[14px] text-center text-nowrap top-[-0.4px] translate-x-[-50%]">Join Caffélino and set up your personal profile</p>
                    </div>
                  </ContainerBackgroundImage1>
                </ContainerBackgroundImage2>
                <ContainerBackgroundImage2 additionalClassNames="left-[382.4px]">
                  <BackgroundImage2>
                    <IconBackgroundImage>
                      <path d="M10.6667 2.66667V8" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                      <path d="M21.3333 2.66667V8" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                      <path d={svgPaths.p8d31b00} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                      <path d="M4 13.3333H28" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                    </IconBackgroundImage>
                  </BackgroundImage2>
                  <ContainerBackgroundImage1 additionalClassNames="w-[233.438px]">
                    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
                      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-[117.17px] not-italic text-[#0a0a0a] text-[18px] text-center text-nowrap top-[0.6px] translate-x-[-50%]">2. Create Group</p>
                    </div>
                    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
                      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[117px] not-italic text-[#525252] text-[14px] text-center text-nowrap top-[-0.4px] translate-x-[-50%]">Invite friends or family to your meetup</p>
                    </div>
                  </ContainerBackgroundImage1>
                </ContainerBackgroundImage2>
                <ContainerBackgroundImage2 additionalClassNames="left-[760.8px]">
                  <BackgroundImage2>
                    <IconBackgroundImage>
                      <path d={svgPaths.p37a10d80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                      <path d={svgPaths.p29027680} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                      <path d="M16 23.3333V8.66667" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                    </IconBackgroundImage>
                  </BackgroundImage2>
                  <ContainerBackgroundImage1 additionalClassNames="w-[239.7px]">
                    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
                      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-[120.33px] not-italic text-[#0a0a0a] text-[18px] text-center text-nowrap top-[0.6px] translate-x-[-50%]">3. Split Bills Easily</p>
                    </div>
                    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
                      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[120px] not-italic text-[#525252] text-[14px] text-center text-nowrap top-[-0.4px] translate-x-[-50%]">Order together and split the bill equally</p>
                    </div>
                  </ContainerBackgroundImage1>
                </ContainerBackgroundImage2>
              </div>
            </div>
            <div className="h-[444px] relative shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(159.042deg, rgba(139, 89, 67, 0.1) 0%, rgba(217, 191, 157, 0.1) 100%)" }}>
              <div className="absolute h-[40px] left-[28px] top-[64px] w-[1103.2px]" data-name="Paragraph">
                <p className="absolute font-['Arial:Regular',sans-serif] leading-[40px] left-[552.08px] not-italic text-[#0a0a0a] text-[32px] text-center text-nowrap top-[1.4px] translate-x-[-50%]">Perfect for Gatherings</p>
              </div>
              <div className="absolute h-[244px] left-[24px] top-[136px] w-[1111.2px]" data-name="Container">
                <div className="absolute bg-white content-stretch flex flex-col h-[120px] items-start left-[4px] pb-0 pt-[24px] px-[24px] rounded-[16px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] top-0 w-[539.6px]" data-name="Container">
                  <div className="content-stretch flex gap-[16px] h-[52px] items-start relative shrink-0 w-full" data-name="Container">
                    <ContainerBackgroundImage>
                      <IconBackgroundImage1>
                        <path d={svgPaths.p1d820380} id="Vector" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d={svgPaths.p27451300} id="Vector_2" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d={svgPaths.p2981fe00} id="Vector_3" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d={svgPaths.p161d4800} id="Vector_4" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </IconBackgroundImage1>
                    </ContainerBackgroundImage>
                    <ContainerBackgroundImage1 additionalClassNames="w-[226.475px]">
                      <BackgroundImage1>{`Friends & Family`}</BackgroundImage1>
                      <ParagraphBackgroundImageAndText text="Create groups with people you know" />
                    </ContainerBackgroundImage1>
                  </div>
                </div>
                <div className="absolute bg-white content-stretch flex flex-col h-[120px] items-start left-[567.6px] pb-0 pt-[24px] px-[24px] rounded-[16px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] top-0 w-[539.6px]" data-name="Container">
                  <div className="content-stretch flex gap-[16px] h-[72px] items-start relative shrink-0 w-full" data-name="Container">
                    <ContainerBackgroundImage>
                      <IconBackgroundImage1>
                        <path d="M10 2V4" id="Vector" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d="M14 2V4" id="Vector_2" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d={svgPaths.p1f246500} id="Vector_3" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d="M6 2V4" id="Vector_4" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </IconBackgroundImage1>
                    </ContainerBackgroundImage>
                    <div className="basis-0 grow h-[72px] min-h-px min-w-px relative shrink-0" data-name="Container">
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
                        <ParagraphBackgroundImageAndText1 text="Vote on Café Together" />
                        <div className="h-[40px] relative shrink-0 w-full" data-name="Paragraph">
                          <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#525252] text-[14px] top-[-0.4px] w-[403px]">Choose from up to 3 cafés and let everyone vote on their favorite spot.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute bg-white content-stretch flex flex-col h-[100px] items-start left-[4px] pb-0 pt-[24px] px-[24px] rounded-[16px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] top-[144px] w-[539.6px]" data-name="Container">
                  <div className="content-stretch flex gap-[16px] h-[52px] items-start relative shrink-0 w-full" data-name="Container">
                    <ContainerBackgroundImage>
                      <IconBackgroundImage1>
                        <path d={svgPaths.p104a6f80} id="Vector" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d={svgPaths.p3836560} id="Vector_2" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d="M12 17.5V6.5" id="Vector_3" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </IconBackgroundImage1>
                    </ContainerBackgroundImage>
                    <ContainerBackgroundImage1 additionalClassNames="w-[382.85px]">
                      <ParagraphBackgroundImageAndText1 text="Equal Bill Splitting" />
                      <ParagraphBackgroundImageAndText text="Bills are automatically split equally among all group members." />
                    </ContainerBackgroundImage1>
                  </div>
                </div>
                <div className="absolute bg-white content-stretch flex flex-col h-[100px] items-start left-[567.6px] pb-0 pt-[24px] px-[24px] rounded-[16px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] top-[144px] w-[539.6px]" data-name="Container">
                  <div className="content-stretch flex gap-[16px] h-[52px] items-start relative shrink-0 w-full" data-name="Container">
                    <ContainerBackgroundImage>
                      <BackgroundImage>
                        <g clipPath="url(#clip0_575_447)" id="Icon">
                          <path d={svgPaths.p3eebfc00} id="Vector" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          <path d="M20 2V6" id="Vector_2" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          <path d="M22 4H18" id="Vector_3" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          <path d={svgPaths.p352890c0} id="Vector_4" stroke="var(--stroke-0, #8B5943)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </g>
                        <defs>
                          <clipPath id="clip0_575_447">
                            <rect fill="white" height="24" width="24" />
                          </clipPath>
                        </defs>
                      </BackgroundImage>
                    </ContainerBackgroundImage>
                    <ContainerBackgroundImage1 additionalClassNames="w-[424.875px]">
                      <BackgroundImage1>{`Group Chat & Menu`}</BackgroundImage1>
                      <ParagraphBackgroundImageAndText text="Chat with your group and share food orders with images in real-time." />
                    </ContainerBackgroundImage1>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[64.8px] relative shrink-0 w-full" data-name="Container">
              <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0.8px_0px_0px] border-solid inset-0 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bg-[#be9d80] border-[0px_0px_0.8px] border-black border-solid h-[55.2px] left-0 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-0 w-[1174.4px]" data-name="AppContent">
        <div className="absolute h-[40px] left-[16px] top-[7.6px] w-[51.713px]" data-name="Image (Logo)" />
        <div className="absolute content-stretch flex gap-[12px] h-[36px] items-center left-[1026.93px] top-[9.6px] w-[131.475px]" data-name="Container">
          <div className="relative rounded-[2.68435e+07px] shrink-0 size-[36px]" data-name="Button">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-0 pt-[8px] px-[8px] relative size-full">
              <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
                <div className="absolute inset-[87.5%_42.78%_8.33%_42.78%]" data-name="Vector">
                  <div className="absolute inset-[-100.03%_-28.87%_-100.01%_-28.87%]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.55361 2.50007">
                      <path d={svgPaths.p1f8ebe00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    </svg>
                  </div>
                </div>
                <div className="absolute inset-[8.33%_12.5%_29.17%_12.5%]" data-name="Vector">
                  <div className="absolute inset-[-6.67%_-5.56%]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6664 14.1667">
                      <path d={svgPaths.p259fd370} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white h-[36px] relative rounded-[10px] shrink-0 w-[83.475px]" data-name="Button">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[24px] py-[8px] relative size-full">
              <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#0f172b] text-[14px] text-center text-nowrap">Login</p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute left-[-16px] size-[219px] top-[-82px]" data-name="mylogo 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgMylogo1} />
      </div>
      <div className="absolute bg-white content-stretch flex h-[72px] items-center justify-between left-0 pb-0 pt-[0.8px] px-[16px] top-[657.6px] w-[1174.4px]" data-name="AppContent">
        <div aria-hidden="true" className="absolute border-[0.8px_0px_0px] border-black border-solid inset-0 pointer-events-none shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" />
        <div className="h-[20px] relative shrink-0 w-[915.425px]" data-name="Paragraph">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
            <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#45556c] text-[14px] text-nowrap top-[-1.2px]">Join Caffélino to create and join groups</p>
          </div>
        </div>
        <div className="bg-[#8b4513] h-[36px] relative rounded-[10px] shrink-0 w-[130.975px]" data-name="Button">
          <BackgroundImageAndText1 text="Login / Sign Up" additionalClassNames="px-[16px]" />
        </div>
        <div className="relative rounded-[2.68435e+07px] shrink-0 size-[48px]" data-name="Container">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip p-[1.6px] relative rounded-[inherit] size-full">
            <div className="h-[44.8px] relative shrink-0 w-full" data-name="Image (Profile Avatar)">
              <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageProfileAvatar} />
            </div>
          </div>
          <div aria-hidden="true" className="absolute border-[#c6d2ff] border-[1.6px] border-solid inset-0 pointer-events-none rounded-[2.68435e+07px]" />
        </div>
      </div>
    </div>
  );
}