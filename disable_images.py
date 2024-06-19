import json
import os

def read_json(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

def disable_images(json_data):
    def traverse_and_modify(data):
        if isinstance(data, dict):
            for key, value in data.items():
                # Check for image-related fields
                if key in ["image", "backgroundImage", "objectBackgroundImage", "rowBackgroundImage", "imageLink"]:
                    data[key] = ""
                elif key in ["imageIsUrl", "objectImgBorderIsOn"]:
                    data[key] = False
                else:
                    traverse_and_modify(value)
        elif isinstance(data, list):
            for item in data:
                traverse_and_modify(item)
    
    traverse_and_modify(json_data)
    return json_data

def write_json(file_path, json_data):
    with open(file_path, 'w') as file:
        json.dump(json_data, file, indent=2)

def update_and_save_json(file_path):
    json_data = read_json(file_path)
    json_data = disable_images(json_data)
    write_json(file_path, json_data)

if __name__ == "__main__":    
    projectFile = "project.json"
    projectFileLight = "project_light.json"
    update_and_save_json(projectFile)
    update_and_save_json(projectFileLight)
