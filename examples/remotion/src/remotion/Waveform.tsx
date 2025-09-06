import { Composition, PanEffectData, RenderableComponentData, TextAtomDataWithFonts, WaveformCircleDataProps, WaveformConfig, WaveformHistogramDataProps, WaveformHistogramRangedDataProps, WaveformLineDataProps, WaveformPresets, ZoomEffectData } from "@microfox/remotion";

const audioMetadata = {
    // turntogold - https://cdn1.suno.ai/db192e72-b371-4462-b7b8-78278c550450.webm
    // epic - src: "https://cdn1.suno.ai/26abf813-e0af-4bda-8cd4-93344dd76473.webm", 
    // epic 2 - https://cdn1.suno.ai/eaebca37-01b7-47ff-ab70-d40fcd442405.webm
    // gotoblue - https://cdn1.suno.ai/04ae0ed2-54bb-45c5-a67a-586e83d5a91c.webm
    // whiteboard funeral - https://cdn1.suno.ai/593e02b7-c238-4594-9e48-9f7334d70532.webm
    //src: "https://cdn1.suno.ai/5008ce4f-e7f6-41d6-818c-08ea0813d75e.webm",
    src: "titans.mp3",
    //src: "https://cdn1.suno.ai/75c0d53b-4437-43a7-a9ea-fae4716286b0.webm",
    //src: "https://cdn1.suno.ai/8ffa96ca-d37b-48dc-b8b2-74f263dad10c.webm",
    //src: "https://cdn1.suno.ai/eeae767e-20df-490b-9476-08abfa484c41.webm",
    volume: 2,
    duration: (2 * 60) + 5,
}

const imageMetadata = {
    src: "standing.png",//"https://cdn.midjourney.com/cffd1fdb-3a43-47f7-b7d3-c0e795094d78/0_1.png",
    //src: "https://cdn.midjourney.com/02465c52-e547-402e-a55f-9805dab2886f/0_0.png",
    primaryColor: '#FFF',
    secondaryColor: '#FDCE99',
    text: 'Titans',
    textMarginBottom: 180,
    textColor: '#FFF',
    textSize: 250,
    textFont: "ProtestRevolution",//"Roboto", ProtestRevolution, StoryScript, BebasNeue, Caveat
    subtext: "The Dream",
    subtextMarginBottom: 50,
    subtextSize: 20,
    channelText: "Get into Zone",
}

const stopgapLine = WaveformPresets.stopgapLine({
    config: {
        audioSrc: audioMetadata.src,
        posterize: 4,
        width: 1920 * 2,
    },
    strokeColor: '#FFF',
})

const stopgapCircle = {
    componentId: "WaveformCircle",
    type: "atom",
    data: {
        config: {
            audioSrc: audioMetadata.src,
            height: 1080,
            numberOfSamples: 128,
            amplitude: 1,
        },
        strokeColor: '#FFF',
        strokeWidth: 8,

        gradientStartColor: '#FFF',
        gradientEndColor: '#BFCE45',
        radius: 20,
        centerX: 0,
        centerY: 0,
        startAngle: 0,
        endAngle: 360,
        amplitude: 1,
        rotationSpeed: 0.5,
    } as WaveformCircleDataProps
}

const histogram = {
    componentId: "WaveformHistogram",
    type: "atom",
    data: {
        config: {
            audioSrc: audioMetadata.src,
            numberOfSamples: 32,
            windowInSeconds: 1,
            amplitude: 2,
            width: 1920,
            height: 200,
            dataOffsetInSeconds: - 0.1,
            useFrequencyData: false,
        } as WaveformConfig,
        barColor: '#A41117',
        barSpacing: 8,
        barBorderRadius: 4,
        barWidth: 4,
        multiplier: 1,
        horizontalSymmetry: true,
        verticalMirror: true,
        histogramStyle: 'full-width',
        amplitude: 3.5,
        gradientStartColor: imageMetadata.primaryColor ?? '#FFF',
        gradientEndColor: imageMetadata.secondaryColor ?? '#000',
        gradientDirection: 'vertical',
        gradientStyle: 'mirrored',
        className: 'rounded-lg absolute bottom-0',
        waveDirection: 'right-to-left',
    } as WaveformHistogramRangedDataProps
}

const histogramStatic = {
    componentId: "WaveformHistogramRanged",
    type: "atom",
    data: {
        config: {
            audioSrc: audioMetadata.src,
            numberOfSamples: 64,
            windowInSeconds: 1 / 30,
            amplitude: 1,
            width: 1920,
            height: 300,
            dataOffsetInSeconds: 0,
            useFrequencyData: true,
        } as WaveformConfig,
        barColor: '#A41117',
        barSpacing: 10,
        barBorderRadius: 8,
        barWidth: 4,
        multiplier: 1,
        horizontalSymmetry: false,
        verticalMirror: true,
        histogramStyle: 'full-width',
        amplitude: 0.75,
        gradientStartColor: imageMetadata.primaryColor ?? '#FFF',
        gradientEndColor: imageMetadata.secondaryColor ?? '#000',
        gradientDirection: 'vertical',
        gradientStyle: 'mirrored',
        className: 'rounded-lg absolute bottom-0',
        waveDirection: 'right-to-left',
    } as WaveformHistogramRangedDataProps
}


const AudioScene = {
    id: "AudioScene",
    componentId: "BaseLayout",
    type: "layout",
    data: {
        containerProps: {
            className: 'flex items-center justify-center bg-black',
        },
        childrenProps: [
            {
                className: '',
            },
            {
                className: 'inset-0 absolute',
            },
            {
                className: 'absolute -bottom-1',
                style: {
                    background: `linear-gradient(to bottom, transparent 0%,  #000000 100%)`,
                },
            },
            {
                className: 'absolute bottom-0'
            },
            {
                className: 'absolute bottom-0',
            },
            {
                className: 'absolute top-10 bottom-0 flex items-center justify-center'
            },
        ]
    },
    context: {
        timing: { start: 0, duration: audioMetadata.duration },
    },
    childrenData: [
        {
            id: 'Audio-xyz',
            componentId: "AudioAtom",
            type: 'atom',
            data: {
                src: audioMetadata.src,
                volume: 2
            }
        },
        {
            id: 'Image-xyz',
            componentId: "ImageAtom",
            type: 'atom',
            effects: [
                {
                    componentId: "pan",
                    id: "zoom-xyz",
                    data: {
                        panDirection: "up",
                        panDistance: 400,
                        loopTimes: 3,
                        // zoomDuration: "100%",
                        // zoomStart: 0,
                        // zoomDepth: 1.25,
                        // loopTimes: 4,
                    } as PanEffectData
                }
            ],
            data: {
                className: 'w-full h-auto object-contain',
                src: imageMetadata.src,
                // "https://i.pinimg.com/originals/d9/4a/b8/d94ab8f621436edc68f91be228365ae9.jpg",
                //src: "https://i.pinimg.com/originals/64/70/b6/6470b60e2b75702ae09e3dab21728653.jpg",
            }
        },
        {
            id: 'WaveformLine-xyz',
            ...histogramStatic,
        },
        {
            id: 'text-xyz',
            componentId: "TextAtomWithFonts",
            type: 'atom',
            data: {
                text: imageMetadata.text,
                className: 'rounded-xl',
                style: {
                    fontSize: imageMetadata.textSize,
                    color: imageMetadata.textColor,
                    marginBottom: imageMetadata.textMarginBottom,
                    borderRadius: 40,
                    letterSpacing: 10,
                    fontWeight: 100,
                },
                font: {
                    family: imageMetadata.textFont,
                }
            } as TextAtomDataWithFonts
        },
        {
            id: 'text-xyz-boxed',
            componentId: "TextAtomWithFonts",
            type: 'atom',
            data: {
                text: imageMetadata.subtext,
                className: 'bg-black/30 px-12 py-4 rounded-xl backdrop-blur-sm',
                style: {
                    fontSize: imageMetadata.subtextSize,
                    color: "#FFF",
                    textTransform: 'uppercase',
                    letterSpacing: 10,
                    marginBottom: imageMetadata.subtextMarginBottom,
                    fontWeight: 700,
                    borderRadius: 40,
                },
                font: {
                    family: 'Inter',
                    weights: ['100', '400', '700'],
                }
            } as TextAtomDataWithFonts
        },
        {
            id: 'text-xyz-3',
            componentId: "TextAtomWithFonts",
            type: 'atom',
            data: {
                text: imageMetadata.channelText,
                className: ' px-0 py-4 text-center',
                style: {
                    fontSize: 25,
                    color: "#FFF",
                    textTransform: 'uppercase',
                    letterSpacing: 60,
                    fontWeight: 700,
                    borderRadius: 40,
                    marginLeft: 80,
                },
                font: {
                    family: 'Inter',
                    weights: ['100', '400', '700'],
                }
            } as TextAtomDataWithFonts
        }
    ],
};

export const Waveform: React.FC = () => {
    return (
        <Composition
            id="Waveform"
            componentId="Waveform"
            type="scene"
            childrenData={[AudioScene as RenderableComponentData]}
            fps={30}
            width={1920}
            height={1080}
            duration={audioMetadata.duration}
            style={{
                backgroundColor: "black",
            }}
        />
    );
}; 