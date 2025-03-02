export const getCreativePrompt = (prompt: string) => {
    return (`
            Generate a highly detailed description of the UI features for prompt- ${prompt}.
            Ensure that the design aligns closely with user choices and preferences.
            Include the following key points such as what all key sections/part should be there and what all features and elements should be there in each section.
            also include the color schemes and background colors to match the branding.
            Produce a detailed description of each component required in the UI,
            ensuring that all key aspects are covered and that the information is clear and comprehensive.
            Customizable Colorful Styles
            In addition to its comprehensive structure, our HTML template includes various colorful styles to suit your brand's aesthetic. The template supports customization options, allowing you to:
            Choose from a variety of color schemes to match your branding.
            Apply different background colors and gradients to sections for a vibrant and engaging look.
            Customize font colors and button styles to enhance readability and user interaction.
            Ensure a visually consistent and appealing presentation across all devices.
            eg1 - if its a landing page - generate description for elements like header, pricing, contactus, faq, features, footer, testimonials etc.
            eg2 - if its a login page - generate description for forget password, oauth providers like google, microsoft, signup, terms accepting checkbox.
            eg3 - if its a music player - generate description for detailed sidebar inclduing different nav items like playlists, settings, etc, sticking bottom music preview, header with search , rpofile, body with different sections like recomended, new , most liked , with approriate icons to be placed etc.
            depending on the prompt asked generates detailed description based on the attributes that is relevant for the prompt.
        `
    );
}; 