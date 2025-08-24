import { Composition, RenderableComponentData } from "@microfox/remotion";

const RingsAndLogoScene = {
    id: "ringsAndLogo",
    componentId: "BaseLayout",
    type: "layout",
    data: {
        containerProps: {
            className: 'flex items-center justify-center',
        },
        childrenProps: [
            {
                className: 'inset-0 absolute',
            },
            {
                className: 'h-[150px]! bg-red-500',
            }
        ]
    },
    context: {
        timing: { start: 0, duration: 3 },
    },
    childrenData: [
        {
            id: 'Rings-xyz',
            componentId: "Rings",
            type: 'atom',
        },
        {
            id: 'NextjsLogo-xyz',
            componentId: "NextjsLogo",
            type: 'atom'
        }
    ],
};

const TextFadeInScene = {
    id: 'TextFade-xyz',
    componentId: "TextFade",
    type: 'layout',
    context: {
        boundaries: { zIndex: 1 },
        timing: { start: 0, duration: 2 },
    },
    data: {
        animation: {
            duration: 1,
        }
    },
    childrenData: [
        {
            id: 'TextAtom-xyz',
            componentId: "TextAtom",
            type: 'atom',
            data: {
                text: 'Testing Remotion',
                style: {
                    fontSize: '10rem',
                    color: 'black',
                }
            }
        }
    ]
}

export const Ripple: React.FC = () => {
    return (
        <Composition
            id="Root"
            componentId="Root"
            type="scene"
            childrenData={[
                {
                    id: "RippleOutLayout-xyz",
                    componentId: "RippleOutLayout",
                    type: "layout",
                    data: {
                        transitionStart: 2,
                        transitionDuration: 1,
                    },
                    context: {
                        timing: { start: 0, duration: 4 },
                    },
                    childrenData: [
                        RingsAndLogoScene as RenderableComponentData,
                        TextFadeInScene as RenderableComponentData,
                    ]
                }
            ]}
            fps={30}
            width={1920}
            height={1080}
            duration={4}
            style={{
                backgroundColor: "black",
            }}
        />
    );
}; 