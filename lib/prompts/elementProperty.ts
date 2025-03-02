export const getElementProperty = () => {
    return (`
        Describe this UI in accurate details in point wise. When you reference a UI element put its name and bounding box in the format: [object name (y_min, x_min, y_max, x_max)]. Also Describe the color of the elements.
        Do not generate html or react code just give me the properties of each element in this format.
        For the given image, calculate the properties of each element and provide the details for each element.
        Also include body tag. Assign maximum occuring color as background color of body.
        for icons calculate the size of the icon.
        Response Format:
        1. [element description (y_min, x_min, y_max, x_max)]
            - color: value1
            - background color: value2

        Also for each elements like input, button etc let the element description be its title or placholder to identify it and provide its properties like border, border radius, padding, margin etc along with color and background color
    `);
};

export const getRefinedElementProperty = (description: string) => {
    return (`
        Compare the described UI elements with the provided image and identify any missing elements or inaccuracies. Also Describe the color of the elements. Provide a refined and accurate description of the UI elements based on this comparison. Here is the initial description: ${description}
        Add properties for the missing elements and correct any inaccuracies in the initial description. Ensure that the refined description is accurate and comprehensive, covering all key aspects of the UI elements.
        Do not generate html or react code just give me the properties of each element in this format.
        Also include body tag. Assign maximum occuring color as background color of body.
        Also for each elements like input, button etc provide its properties like border, border radius, padding, margin etc.
        for icons calculate the size of the icon.
    `);
}; 