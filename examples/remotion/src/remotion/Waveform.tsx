import { Composition, PanEffectData, RenderableComponentData, TextAtomDataWithFonts, WaveformCircleDataProps, WaveformConfig, WaveformHistogramDataProps, WaveformLineDataProps, WaveformPresets, ZoomEffectData } from "@microfox/remotion";

const audioMetadata = {
    src: "https://cdn1.suno.ai/9ed7526d-2bf1-452f-b3da-b4a3994f437a.webm",
    //src: "https://cdn1.suno.ai/8ffa96ca-d37b-48dc-b8b2-74f263dad10c.webm",
    //src: "https://cdn1.suno.ai/eeae767e-20df-490b-9476-08abfa484c41.webm",
    volume: 2,
    duration: (3 * 60) + 42,
}

const imageMetadata = {
    src: "black.png",//"https://cdn.midjourney.com/cffd1fdb-3a43-47f7-b7d3-c0e795094d78/0_1.png",
    //src: "https://cdn.midjourney.com/02465c52-e547-402e-a55f-9805dab2886f/0_0.png",
    primaryColor: '#000',
    secondaryColor: '#FFF',
    text: 'Neon & Nails',
    subtext: "Cyberpunk 2077"
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
            windowInSeconds: 1 / 5,
            amplitude: 0.5,
            width: 1920,
            height: 200,
            dataOffsetInSeconds: -0.15,
        } as WaveformConfig,
        barColor: '#A41117',
        barSpacing: 10,
        barBorderRadius: 8,
        barWidth: 4,
        multiplier: 1,
        horizontalSymmetry: true,
        verticalMirror: true,
        histogramStyle: 'full-width',
        amplitude: 2.5,
        gradientStartColor: imageMetadata.primaryColor ?? '#FFF',
        gradientEndColor: imageMetadata.secondaryColor ?? '#000',
        gradientDirection: 'vertical',
        gradientStyle: 'mirrored',
        className: 'rounded-lg absolute bottom-0',
        waveDirection: 'right-to-left',
    } as WaveformHistogramDataProps
}


const AudioScene = {
    id: "AudioScene",
    componentId: "BaseLayout",
    type: "layout",
    data: {
        containerProps: {
            className: 'flex items-center justify-center bg-white',
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
                className: 'absolute bottom-0'
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
                volume: 2,
            }
        },
        {
            id: 'Image-xyz',
            componentId: "ImageAtom",
            type: 'atom',
            effects: [{
                componentId: "pan",
                id: "zoom-xyz",
                data: {
                    panDirection: "up",
                    panDistance: 280,
                    loopTimes: 2,
                    // zoomDuration: "100%",
                    // zoomStart: 0,
                    // zoomDepth: 1.25,
                    // loopTimes: 4,
                } as PanEffectData
            }],
            data: {
                className: 'w-full h-auto object-contain',
                src: imageMetadata.src
                // "https://i.pinimg.com/originals/d9/4a/b8/d94ab8f621436edc68f91be228365ae9.jpg",
                //src: "https://i.pinimg.com/originals/64/70/b6/6470b60e2b75702ae09e3dab21728653.jpg",
            }
        },
        {
            id: 'WaveformLine-xyz',
            ...histogram,
        },
        {
            id: 'WaveformLine-xyz',
            ...histogram,
        },
        {
            id: 'text-xyz',
            componentId: "TextAtomWithFonts",
            type: 'atom',
            data: {
                text: imageMetadata.text,
                className: 'rounded-xl',
                style: {
                    fontSize: 150,
                    color: '#C52C40',
                    marginBottom: 150,
                    borderRadius: 40,
                    letterSpacing: 10,
                    fontWeight: 700,
                },
                font: {
                    family: 'Caveat',
                    weights: ['400', '700'],
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
                    fontSize: 20,
                    color: "#FFF",
                    textTransform: 'uppercase',
                    letterSpacing: 10,
                    marginBottom: 325,
                    fontWeight: 700,
                    borderRadius: 40,
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