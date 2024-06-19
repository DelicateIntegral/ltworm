import os
import json

# Function to read JSON data from a file
def read_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)  # Load JSON data from the file
    return data

# Function to write JSON data to a file
def write_json(file_path, json_data, minify):
    with open(file_path, 'w', encoding='utf-8') as f:
        indent = None if minify else 2  # Minify JSON if required
        separators = (',', ':') if minify else None  # Use compact separators if minifying
        json.dump(json_data, f, indent=indent, separators=separators)  # Write JSON data to the file

# Function to change URLs in JSON data
def change_urls(json_data, old_prefix, new_prefix):
    # Helper function to traverse and modify data
    def traverse_and_modify(data):
        if isinstance(data, dict):  # If data is a dictionary
            for key, value in data.items():
                if key in ["image", "imageLink"] and isinstance(value, str) and value.startswith(old_prefix):
                    data[key] = new_prefix + value[len(old_prefix):]  # Replace old URL prefix with new prefix
                else:
                    traverse_and_modify(value)  # Recursively modify nested data
        elif isinstance(data, list):  # If data is a list
            for item in data:
                traverse_and_modify(item)  # Recursively modify each item in the list
    
    traverse_and_modify(json_data)
    return json_data

# Function to disable images in JSON data
def disable_images(json_data):
    # Helper function to traverse and modify data
    def traverse_and_modify(data):
        if isinstance(data, dict):  # If data is a dictionary
            for key, value in data.items():
                if key in ["image", "backgroundImage", "objectBackgroundImage", "rowBackgroundImage", "imageLink"]:
                    data[key] = ""  # Remove image URLs
                elif key in ["imageIsUrl", "objectImgBorderIsOn"]:
                    data[key] = False  # Disable image-related boolean fields
                else:
                    traverse_and_modify(value)  # Recursively modify nested data
        elif isinstance(data, list):  # If data is a list
            for item in data:
                traverse_and_modify(item)  # Recursively modify each item in the list
    
    traverse_and_modify(json_data)
    return json_data

# Function to invert a color value
def invert_color(color):
    if color.startswith("#"):
        color = color.lstrip('#')
        if len(color) == 6:  # RGB format without alpha
            r, g, b = color[:2], color[2:4], color[4:]
            r = format(255 - int(r, 16), '02x')
            g = format(255 - int(g, 16), '02x')
            b = format(255 - int(b, 16), '02x')
            return f"#{r}{g}{b}"
        elif len(color) == 8:  # RGBA format with alpha
            r, g, b, a = color[:2], color[2:4], color[4:6], color[6:]
            r = format(255 - int(r, 16), '02x')
            g = format(255 - int(g, 16), '02x')
            b = format(255 - int(b, 16), '02x')
            return f"#{r}{g}{b}{a}"
        else:
            raise ValueError(f"Invalid color format: {color}")
    else:
        return color

# Recursive function to invert style values in JSON data
def invert_style_recursive(data):
    if isinstance(data, dict):  # If data is a dictionary
        for key, value in data.items():
            if key == "styling" and isinstance(value, dict):
                data[key] = invert_style_values(value)  # Invert styling values
            else:
                data[key] = invert_style_recursive(value)  # Recursively modify nested data
    elif isinstance(data, list):  # If data is a list
        for i, item in enumerate(data):
            data[i] = invert_style_recursive(item)  # Recursively modify each item in the list
    return data

# Function to invert specific style values
def invert_style_values(style):
    inverted_style = {}
    for key, value in style.items():
        if key.startswith("bar"):
            inverted_style[key] = value  # Preserve "bar" keys unchanged
        elif isinstance(value, str) and (key.endswith("Color") or key.endswith("BgColor")):
            inverted_style[key] = invert_color(value)  # Invert color values
        elif isinstance(value, int):
            inverted_style[key] = value  # Handle integer values if needed
        else:
            inverted_style[key] = value
    return inverted_style

def main():
    # Default values
    directory_path = os.getcwd()
    minify = True
    project_file = "project.json"
    dark = "dark.json"
    light = "light.json"
    dark_noimg = "dark_noimg.json"
    light_noimg = "light_noimg.json"
    project_path = os.path.join(directory_path, project_file)
    old_prefix = "https://cyoa.ltouroumov.ch/"
    new_prefix = "https://github.com/DelicateIntegral/ltworm/tree/delicate"

    # Read the project JSON data
    data = read_json(project_path)
    data = change_urls(data, old_prefix, new_prefix)  # Change URLs in the data

    # Remove existing json files
    for filename in os.listdir(directory_path):
        if filename in [dark, light, dark_noimg, light_noimg]:
            os.remove(os.path.join(directory_path, filename))
    
    # Write the dark theme JSON file
    write_json(os.path.join(directory_path, dark), data, minify)

    # Invert styles for the light theme and write the JSON file
    inverted_data = invert_style_recursive(data)
    write_json(os.path.join(directory_path, light), inverted_data, minify)
    
    # Disable images for the dark theme and write the JSON file
    data = disable_images(data)
    write_json(os.path.join(directory_path, dark_noimg), data, minify)
    
    # Disable images for the light theme and write the JSON file
    inverted_data = disable_images(data)
    write_json(os.path.join(directory_path, light_noimg), inverted_data, minify)

# Entry point of the script
if __name__ == "__main__":
    main()
