export const getBalancedPrompt = (prompt: string) => {
    return (`
            Generate a detailed description of the UI features for the prompt: ${prompt}. Ensure that the design 
            aligns closely with user choices and preferences. Include the following key points: Key Sections and Features: 
            Describe the essential sections or parts of the UI. Specify how each element should be placed. 
            If you are aware of the ui of the application the user is asking then create exact ui without sompremising the theme and icons.
            Color scheme - if use ask for existing specific application like netflix, youtube then try to develop application based on that exact theme. 
            Color Schemes and Branding: Suggest color schemes and background colors that match the branding. 
            Also make user the text color is readable based on the background color.
            Provide customization options for color schemes, background colors, gradients, font colors, and button styles.
            Component Descriptions: Produce a detailed description of each UI component. Ensure clarity and comprehensiveness 
            in covering all key aspects. Ensure a visually consistent and appealing presentation across all devices. Example Scenarios: 
            If user ask's a landing page, describe elements such as the header, pricing, contact us, FAQ, features, footer, testimonials, etc. 
            If user ask's a login page, describe elements such as forget password, OAuth providers (Google, Microsoft), signup, terms accepting 
            checkbox, etc. If user ask's a music player, describe elements such as a detailed sidebar with navigation items (playlists, settings), 
            a sticky bottom music preview, a header with search and profile, a body with sections like recommended, new, most liked, with 
            appropriate icons. Generate the detailed description based on the attributes that are relevant to the given prompt, ensuring the 
            design is accurate to user choices and preferences.
        `
    );
}; 