Changelog:

- **Date:** [06/19/2024]
- **Changes:**
  - Disabled images in JSON data by setting all 'image' and image-related fields to empty strings ("").
  - Updated project.json and project_light.json to reflect these changes.

Details:
The "disable_images.py" script modified the JSON files to disable images by clearing all image-related fields. This change ensures that no image paths or URLs are present in the JSON data, effectively disabling image functionality as per the project requirements.
