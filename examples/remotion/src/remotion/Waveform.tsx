import { Composition, RenderableComponentData, TextAtomDataWithFonts, WaveformCircleDataProps, WaveformHistogramDataProps, WaveformLineDataProps, WaveformPresets } from "@microfox/remotion";

const audioMetadata = {
    src: "https://cdn1.suno.ai/eeae767e-20df-490b-9476-08abfa484c41.webm",
    volume: 2,
    duration: (2 * 60) + 40,
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
            amplitude: 1,
            width: 1920,
            height: 200,
        },
        barColor: '#A41117',
        barSpacing: 10,
        barBorderRadius: 8,
        barWidth: 4,
        multiplier: 1,
        horizontalSymmetry: true,
        verticalMirror: true,
        histogramStyle: 'full-width',
        amplitude: 2.5,
        gradientStartColor: '#FFF',
        gradientEndColor: '#000',
        gradientDirection: 'vertical',
        gradientStyle: 'mirrored',
        className: 'rounded-lg absolute bottom-0',
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
                className: 'absolute bottom-0',
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
            data: {
                className: 'w-full h-full object-cover ',
                src: "https://i.pinimg.com/originals/d9/4a/b8/d94ab8f621436edc68f91be228365ae9.jpg",
                //src: "https://i.pinimg.com/originals/64/70/b6/6470b60e2b75702ae09e3dab21728653.jpg",
            }
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
                text: 'Agent of Chaos',
                style: {
                    fontSize: 20,
                    color: '#FFF',
                    textTransform: 'uppercase',
                    letterSpacing: 20,
                    marginBottom: 230,
                    fontWeight: 100,
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