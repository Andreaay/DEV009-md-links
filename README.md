# mdLinks

## Description

**mdLinks** is a command-line tool (CLI) that allows you to analyze and validate links in Markdown files (files with the .md extension). With **mdLinks**, you can quickly check the integrity of links in your Markdown documents and get detailed information about each link, including its status (active or broken) and associated text.

## Key Features

- **Link Analysis**: Scans Markdown files for links and presents them in a clear and readable format.
- **Link Validation**: Checks the availability of links, reporting whether they are active or broken.
- **Link Statistics**: Provides statistics on the total number of links and unique links in a file or directory.
- **Optional Customization**: You can choose whether to validate links and customize the displayed information.

## Basic Usage

1. Install **mdLinks** from GitHub:

   ```bash
   npm install -g github:andreaay/dev009-md-links

2. Run the command in the command line, providing the path to a Markdown file:

   ```bash
   md-links my-file.md

3. Get detailed information about the links in the file, including their status and associated text.

4. Optionally, you can use the --validate and --stats options to validate links and obtain additional statistics.

   ```bash
   md-links my-file.md --validate

  or

  ```bash
  md-links my-file.md --validate
