import svgPaths from "./svg-0aujtn2rnu";
import clsx from "clsx";
const imgImageProfileAvatar = "/profileAvatar.png";
type ContainerBackgroundImage1Props = {
  additionalClassNames?: string;
  text: string;
};

function ContainerBackgroundImage1({ children, additionalClassNames = "", text }: React.PropsWithChildren<ContainerBackgroundImage1Props>) {
  return (
    <div className={clsx("relative rounded-[16px] shrink-0 size-[40px]", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pl-0 pr-[0.012px] py-0 relative size-full">
        <BackgroundImage2 additionalClassNames="h-[28px] w-[27.462px]">
          <p className="absolute font-['Arial:Regular',sans-serif] leading-[28px] left-0 not-italic text-[#2c1810] text-[20px] text-nowrap top-[-2.2px]">{text}</p>
        </BackgroundImage2>
      </div>
    </div>
  );
}

function BackgroundImage3({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="size-full">
      <div className="content-stretch flex flex-col items-start pb-[0.8px] pt-[20.8px] px-[20.8px] relative size-full">{children}</div>
    </div>
  );
}
type ContainerBackgroundImageProps = {
  additionalClassNames?: string;
};

function ContainerBackgroundImage({ children, additionalClassNames = "" }: React.PropsWithChildren<ContainerBackgroundImageProps>) {
  return (
    <div className={clsx("relative shrink-0", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">{children}</div>
    </div>
  );
}
type BackgroundImage2Props = {
  additionalClassNames?: string;
};

function BackgroundImage2({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage2Props>) {
  return (
    <div className={clsx("relative shrink-0", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">{children}</div>
    </div>
  );
}

function BackgroundImage1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="h-[24px] relative shrink-0 w-full">
      <div className="absolute h-[24px] left-0 top-0 w-[11.988px]">
        <p className="absolute font-['Arial:Regular','Noto_Sans_Symbols2:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#00a63e] text-[16px] text-nowrap top-[-2.2px]">{"✓"}</p>
      </div>
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-[19.99px] not-italic text-[#364153] text-[16px] text-nowrap top-[-2.2px]">{children}</p>
    </div>
  );
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
type ParagraphBackgroundImageAndText1Props = {
  text: string;
};

function ParagraphBackgroundImageAndText1({ text }: ParagraphBackgroundImageAndText1Props) {
  return <BackgroundImage1>{text}</BackgroundImage1>;
}
type ButtonBackgroundImageAndTextProps = {
  text: string;
  additionalClassNames?: string;
};

function ButtonBackgroundImageAndText({ text, additionalClassNames = "" }: ButtonBackgroundImageAndTextProps) {
  return (
    <div className={clsx("absolute bg-white border-[#8ec5ff] border-[1.6px] border-solid h-[43.2px] rounded-[12px] top-0 w-[87.988px]", additionalClassNames)}>
      <p className="absolute font-['Consolas:Bold',sans-serif] leading-[24px] left-[42.5px] not-italic text-[#1447e6] text-[16px] text-center text-nowrap top-[7.4px] translate-x-[-50%]">{text}</p>
    </div>
  );
}
type ParagraphBackgroundImageAndTextProps = {
  text: string;
};

function ParagraphBackgroundImageAndText({ text }: ParagraphBackgroundImageAndTextProps) {
  return (
    <div className="h-[20px] relative shrink-0 w-full">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#364153] text-[14px] text-nowrap top-[-1.2px]">{text}</p>
    </div>
  );
}
type HeadingBackgroundImageAndTextProps = {
  text: string;
};

function HeadingBackgroundImageAndText({ text }: HeadingBackgroundImageAndTextProps) {
  return (
    <div className="h-[24px] relative shrink-0 w-full">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] text-nowrap top-[-2.2px]">{text}</p>
    </div>
  );
}

export default function Caffelino() {
  return (
    <div className="bg-[#fffbf5] relative size-full" data-name="caffelino">
      <div className="absolute bg-gradient-to-b from-[#ffffff] h-[1229.6px] left-0 to-[#999999] top-0 via-[#cdcdcd] via-[48.558%] w-[1159.2px]" data-name="JoinMeetup">
        <div className="absolute bg-white content-stretch flex flex-col h-[60.8px] items-start left-0 pb-[0.8px] pt-0 px-[131.6px] top-0 w-[1159.2px]" data-name="Container">
          <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0px_0px_0.8px] border-solid inset-0 pointer-events-none" />
          <div className="h-[60px] relative shrink-0 w-full" data-name="Container">
            <div className="flex flex-row items-center size-full">
              <div className="content-stretch flex items-center justify-between px-[24px] py-0 relative size-full">
                <div className="h-[24px] relative shrink-0 w-[52.15px]" data-name="Button">
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
                    <p className="font-['Arial:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#364153] text-[16px] text-center text-nowrap">← Back</p>
                  </div>
                </div>
                <div className="h-[28px] relative shrink-0 w-[133.75px]" data-name="Container">
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
                    <IconBackgroundImage>
                      <path d="M8.33333 1.66667V3.33333" id="Vector" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                      <path d="M11.6667 1.66667V3.33333" id="Vector_2" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                      <path d={svgPaths.p257a4f00} id="Vector_3" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                      <path d="M5 1.66667V3.33333" id="Vector_4" stroke="var(--stroke-0, #BE9D80)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    </IconBackgroundImage>
                    <BackgroundImage2 additionalClassNames="h-[28px] w-[105.75px]">
                      <p className="absolute font-['Arial:Bold',sans-serif] leading-[28px] left-0 not-italic text-[#101828] text-[18px] text-nowrap top-[-1.4px]">Join Meetup</p>
                    </BackgroundImage2>
                  </div>
                </div>
                <div className="h-0 shrink-0 w-[80px]" data-name="Container" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[48px] h-[1168.8px] items-start left-[243.6px] pb-0 pt-[64px] px-[24px] top-[60.8px] w-[672px]" data-name="Container">
          <div className="h-[180px] relative shrink-0 w-full" data-name="Container">
            <div className="absolute bg-gradient-to-b from-[#be9d80] left-[272px] rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[80px] to-[#a88968] top-0" data-name="Container">
              <div className="absolute left-[20px] size-[40px] top-[20px]" data-name="Icon">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
                  <g id="Icon">
                    <path d={svgPaths.p1a96b600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
                    <path d={svgPaths.p28a9b298} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
                    <path d={svgPaths.p25449c80} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
                    <path d={svgPaths.p1517b200} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
                  </g>
                </svg>
              </div>
            </div>
            <div className="absolute h-[36px] left-0 top-[104px] w-[624px]" data-name="Heading 2">
              <p className="absolute font-['Arial:Bold',sans-serif] leading-[36px] left-[312.23px] not-italic text-[#101828] text-[30px] text-center text-nowrap top-[-2.6px] translate-x-[-50%]">Join a Café Meetup</p>
            </div>
            <div className="absolute h-[28px] left-0 top-[152px] w-[624px]" data-name="Paragraph">
              <p className="absolute font-['Arial:Regular',sans-serif] leading-[28px] left-[311.99px] not-italic text-[#4a5565] text-[18px] text-center text-nowrap top-[-1.4px] translate-x-[-50%]">Enter the meetup code shared by your friend to join</p>
            </div>
          </div>
          <div className="h-[252.8px] relative rounded-[16px] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(247.573deg, rgb(139, 89, 67) 1.4667%, rgb(217, 191, 157) 49.297%, rgb(139, 89, 67) 99.968%)" }}>
            <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
            <div className="size-full">
              <div className="content-stretch flex flex-col gap-[24px] items-start pb-[0.8px] pt-[32.8px] px-[32.8px] relative size-full">
                <div className="content-stretch flex flex-col gap-[12px] h-[127.2px] items-start relative shrink-0 w-full" data-name="Container">
                  <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
                    <p className="absolute font-['Arial:Bold',sans-serif] leading-[20px] left-0 not-italic text-[14px] text-black text-nowrap top-[-1.2px]">Meetup Join Code</p>
                  </div>
                  <div className="h-[63.2px] relative shrink-0 w-full" data-name="Container">
                    <div className="absolute h-[63.2px] left-0 rounded-[16px] top-0 w-[558.4px]" data-name="Text Input">
                      <div className="content-stretch flex items-center overflow-clip pl-[48px] pr-[16px] py-[16px] relative rounded-[inherit] size-full">
                        <p className="font-['Consolas:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[18px] text-black text-nowrap tracking-[1.8px] uppercase">Enter 6-digit code (e.g., ABC123)</p>
                      </div>
                      <div aria-hidden="true" className="absolute border-[1.6px] border-black border-solid inset-0 pointer-events-none rounded-[16px]" />
                    </div>
                    <div className="absolute content-stretch flex h-[63.2px] items-center left-0 pl-[16px] pr-0 py-0 top-0 w-[36px]" data-name="Container">
                      <IconBackgroundImage>
                        <path d={svgPaths.p756c900} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        <path d="M17.5 1.66667L9.5 9.66667" id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        <path d={svgPaths.p21f2c800} id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                      </IconBackgroundImage>
                    </div>
                  </div>
                  <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
                    <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[14px] text-black text-nowrap top-[-1.2px]">The code is case-insensitive and contains letters and numbers</p>
                  </div>
                </div>
                <div className="bg-[#be9d80] h-[36px] opacity-50 relative rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Button">
                  <div className="flex flex-row items-center justify-center size-full">
                    <div className="content-stretch flex gap-[8px] items-center justify-center pl-0 pr-[0.012px] py-0 relative size-full">
                      <BackgroundImage2 additionalClassNames="h-[24px] w-[90.363px]">
                        <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-[45px] not-italic text-[16px] text-black text-center text-nowrap top-[-2.2px] translate-x-[-50%]">Join Meetup</p>
                      </BackgroundImage2>
                      <div className="relative shrink-0 size-[16px]" data-name="Icon">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                          <g id="Icon">
                            <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                            <path d={svgPaths.p1d405500} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                          </g>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[16px] h-[528px] items-start relative shrink-0 w-full" data-name="Container">
            <div className="bg-[#eff6ff] h-[144.8px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
              <div aria-hidden="true" className="absolute border-[#bedbff] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[16px]" />
              <BackgroundImage3>
                <div className="content-stretch flex gap-[16px] h-[103.2px] items-start relative shrink-0 w-full" data-name="Container">
                  <div className="bg-[#2b7fff] relative rounded-[16px] shrink-0 size-[40px]" data-name="Container">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                      <BackgroundImage>
                        <g clipPath="url(#clip0_589_278)" id="Icon">
                          <path d={svgPaths.p2061d800} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d="M16.6667 1.66667V5" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d="M18.3333 3.33333H15" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d={svgPaths.p2661f400} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        </g>
                        <defs>
                          <clipPath id="clip0_589_278">
                            <rect fill="white" height="20" width="20" />
                          </clipPath>
                        </defs>
                      </BackgroundImage>
                    </div>
                  </div>
                  <ContainerBackgroundImage additionalClassNames="h-[103.2px] w-[276.462px]">
                    <HeadingBackgroundImageAndText text="Try Example Codes" />
                    <ParagraphBackgroundImageAndText text="Test the app with these demo meetup codes:" />
                    <div className="h-[43.2px] relative shrink-0 w-full" data-name="Container">
                      <ButtonBackgroundImageAndText text="ABC123" additionalClassNames="left-0" />
                      <ButtonBackgroundImageAndText text="XYZ789" additionalClassNames="left-[95.99px]" />
                    </div>
                  </ContainerBackgroundImage>
                </div>
              </BackgroundImage3>
            </div>
            <div className="bg-[#f0fdf4] h-[173.6px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
              <div aria-hidden="true" className="absolute border-[#b9f8cf] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[16px]" />
              <BackgroundImage3>
                <div className="content-stretch flex gap-[16px] h-[132px] items-start relative shrink-0 w-full" data-name="Container">
                  <ContainerBackgroundImage1 additionalClassNames="bg-[#00c950]" text="💡" />
                  <ContainerBackgroundImage additionalClassNames="h-[132px] w-[273.038px]">
                    <HeadingBackgroundImageAndText text="How It Works" />
                    <div className="content-stretch flex flex-col gap-[8px] h-[104px] items-start relative shrink-0 w-full" data-name="Container">
                      <ParagraphBackgroundImageAndText text="1. Get the join code from your friend" />
                      <ParagraphBackgroundImageAndText text="2. Enter the 6-character code above" />
                      <ParagraphBackgroundImageAndText text="3. Vote for café options (if voting is enabled)" />
                      <ParagraphBackgroundImageAndText text="4. Chat, view menu, and split bills together!" />
                    </div>
                  </ContainerBackgroundImage>
                </div>
              </BackgroundImage3>
            </div>
            <div className="bg-[#fffbeb] h-[177.6px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
              <div aria-hidden="true" className="absolute border-[#fee685] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[16px]" />
              <BackgroundImage3>
                <div className="content-stretch flex gap-[16px] h-[136px] items-start relative shrink-0 w-full" data-name="Container">
                  <ContainerBackgroundImage1 additionalClassNames="bg-[#fe9a00]" text="👥" />
                  <ContainerBackgroundImage additionalClassNames="h-[136px] w-[200.012px]">
                    <HeadingBackgroundImageAndText text="Your Permissions" />
                    <div className="content-stretch flex flex-col gap-[4px] h-[108px] items-start relative shrink-0 w-full" data-name="Container">
                      <ParagraphBackgroundImageAndText1 text="Vote for cafés" />
                      <BackgroundImage1>{`View menu & chat`}</BackgroundImage1>
                      <ParagraphBackgroundImageAndText1 text="Pay your share of bill" />
                      <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
                        <div className="absolute h-[24px] left-0 top-0 w-[13.075px]" data-name="Text">
                          <p className="absolute font-['Arial:Regular','Noto_Sans_Symbols2:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#e7000b] text-[16px] text-nowrap top-[-2.2px]">✗</p>
                        </div>
                        <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-[21.08px] not-italic text-[#364153] text-[16px] text-nowrap top-[-2.2px]">Place orders (admin only)</p>
                      </div>
                    </div>
                  </ContainerBackgroundImage>
                </div>
              </BackgroundImage3>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bg-white content-stretch flex h-[72px] items-center justify-between left-0 pb-0 pt-[0.8px] px-[16px] top-[655.2px] w-[1174.4px]" data-name="AppContent">
        <div aria-hidden="true" className="absolute border-[0.8px_0px_0px] border-black border-solid inset-0 pointer-events-none shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" />
        <BackgroundImage2 additionalClassNames="h-[20px] w-[915.425px]">
          <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#45556c] text-[14px] text-nowrap top-[-1.2px]">Join Caffélino to create and join groups</p>
        </BackgroundImage2>
        <div className="bg-[#8b4513] h-[36px] relative rounded-[10px] shrink-0 w-[130.975px]" data-name="Button">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[16px] py-[8px] relative size-full">
            <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-nowrap text-white">Login / Sign Up</p>
          </div>
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