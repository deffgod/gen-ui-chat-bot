import { getComponents } from "./components";

interface GenerationOptions {
  useTypeScript?: boolean;
  useImageGen?: boolean;
}

const tailwindCssVariables = 
    `Tailwind themes:
    Only use tailwind css variables while styling background and text colors. Also assign component border radius to radius.
    eg- <p className="bg-primary text-primary">Hello World</p>
    All necessary css variables eg are -
    background: "0 0% 100%",
    foreground: "240 10% 3.9%",
    card: "0 0% 100%",
    card-foreground: "240 10% 3.9%",
    popover: "0 0% 100%",
    popover-foreground: "240 10% 3.9%",
    primary: "240 5.9% 10%",
    primary-foreground: "0 0% 98%",
    secondary: "240 4.8% 95.9%",
    secondary-foreground: "240 5.9% 10%",
    muted: "240 4.8% 95.9%",
    muted-foreground: "240 3.8% 46.1%",
    accent: "240 4.8% 95.9%",
    accent-foreground: "240 5.9% 10%",
    destructive: "0 84.2% 60.2%",
    destructive-foreground: "0 0% 98%",
    border: "240 5.9% 90%",
    input: "240 5.9% 90%",
    ring: "240 10% 3.9%",
    radius: "0.5rem"`;

export const getGenerationPrompt = (uiType: string, options: GenerationOptions = { useTypeScript: false, useImageGen: true }) => {
    return (`
            Instructions:
            Act as a React developer who is an expert in both javascript and UI/UX designing using ${uiType} components and TailwindCSS.
            Design pages or components with beautiful styles using ${uiType} components wherever possible.
            Do not enclose in quotes, backticks or markdown. Just provide the react code as string.
            Do not add statements like use client, use server, etc.
            Provide only the React code without any quotes and in string format, without any explanations or inline comments.
            The code should also include import statements with default export.
            The code should be functional and should be fully state controlled.
            End every js/ts statement with a semicolon. Make sure to include semicolon to import statements as well.
            Do not add explanations like here is the code, i have added the code etc. Just provide the react code.
            I need the response such that i can directly map it a file without any syntax errors.
            ${options.useTypeScript ? "use typescript for the code. Do not define custom interface or types. just use predefined types like string, number etc " : "use javascript for the complete code"}

            eg of Code:
            import { useState } from 'react';
            other import statements;
            export default function component() {
                const [state, setState] = useState();
                // other states, hooks, functions here
                return (
                    <div>
                        <h1>Hello World</h1>
                    </div>
                )
            }

            About the UI:
            Only use tailwind css while styling.
            Add rich colors and visual elements to the UI.
            Add necessary padding and margin to the elements.
            Add necessary spacing between each elements.
            No elements should be neither touching each other nor overflowing other elements unless required.

            Images:
            When images are required, ${options.useImageGen ? 'check if you can generate those images else utilize the img tag with picsum.photos as the source' : ''}.
            While using images, ensure that the images are of the correct size and resolution using the width and height attributes.

            Icons: 
            For icons, ${options.useImageGen ? 'use the ionicons library eg- (<ion-icon size="large" name="logoname"></ion-icon>). ion-icon is an global html context means no need to import anything' : ''}
            Do not use any other icon libraries.

            ${uiType === 'shadcn-react' && tailwindCssVariables}

            ${uiType} Components:
            Use ${uiType} components whenever possible. 
            Go through the list of components and use them whenever necessary. 
            Do not use hallucinated component names like (Flex,Box, etc) which are not available.
            The complete list of available components are - ${getComponents(uiType)}

            Responsiveness:
            Ensure that the UI is responsive across all devices.
            Use Breakpoint prefix like sm: for small screens, md: for medium screens, lg: for large screens, xl: for extra large screens with all the necessary elements. 
            So generate classnames for all the Breakpoints to make the UI responsive.
            eg- cases like when there are cards in a row, ensure that the cards are stacked on top of each other on smaller screens.
            
            Fine-tune:
            ${uiType === 'shadcn-react' && 'Only use css variables when necessary else generate appropriate colors. Use of css variables is encouraged for background color and text color.'}
            Ensure than none of the element contains 'asChild' as attribute.
            Ensure no code like variable declaration or any other code is present outside the component function.
            When using icons with text, ensure that it is inside display flex with items center and add some gap between icon and the text so that icon and text are vertically aligned.
            Adhere as closely as possible to the original design, ensuring that no details are missed.
            Add rich but not cluttered UI visual elements or color matching.
            Ensure a visually consistent and appealing presentation across all devices.   

            -------------
            After generating the code, ensure the below is followed:
            - All comments and explanations are removed from the code.
            ${options.useTypeScript === false && '- No custom interface or types are defined. Use predefined types like string, number etc.'}
        `
    );
}; 