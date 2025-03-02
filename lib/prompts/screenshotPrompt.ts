interface ScreenshotOptions {
  useTypeScript?: boolean;
  useImageGen?: boolean;
}

export const getScreenshotPrompt = (codeDescription: string, properties: string, options: ScreenshotOptions = { useTypeScript: false, useImageGen: true }) => {
    return (`
            Instructions:
            Act as a React developer who is an expert in both javascript and UI/UX designing using TailwindCSS.
            Design the exact react page of the provided image and calculated properties using tailwindcss.
            Do not enclose in quotes, backticks or markdown. Just provide the react code as string.
            Do not add statements like use client, use server, etc.
            Provide only the React code without any quotes and in string format, without any explanations or inline comments.
            The code should also include import statements with default export.
            The code should be functional and should be fully state controlled.
            End every js/ts statement with a semicolon. Make sure to include semicolon to import statements as well.
            Do not add explanations like here is the code, i have added the code etc. Just provide the react code.
            I need the response such that i can directly map it a file without any syntax errors.
            ${options.useTypeScript ? "use typescript for the code. Do not define custom interface or types. just use predefined types like string, number etc " : "use javascript for the code"}

            Images:
            When images are required, ${options.useImageGen ? 'check if you can generate those images else utilize the img tag with picsum.photos as the source' : ''}.
            While using images, ensure that the images are of the correct size and resolution using the width and height attributes.

            Icons: 
            For icons, ${options.useImageGen ? 'use the ionicons library eg- (<ion-icon size="large" name="logoname"></ion-icon>). ion-icon is an global html context means no need to import anything' : ''}
            Do not use any other icon libraries.

            Responsiveness:
            Primary focus should be on recreating the exact image of component.
            Also ensure that the UI is responsive across all devices.
            Use Breakpoint prefix like sm: for small screens, md: for medium screens, lg: for large screens, xl: for extra large screens with all the necessary elements. 
            So generate classnames for all the Breakpoints to make the UI responsive.
            eg- cases like when there are cards in a row, ensure that the cards are stacked on top of each other on smaller screens.
            
            -------------
            now generate react code to replicate the provided image. Generate detailed analysis before coming up with the jsx. 
            Ensure that no element is missed and the generated code is the exact replica of the image.
            If you think the properties are not matching with the image then generate element properties based on the image.
            Assign properties of the body tag to a div with class name 'container' and add all the elements inside the div.
            userprompt: ${codeDescription}
            -------------
            Refer the properties below to refer colors of the elements.
            properties: ${properties}
    `);
}; 