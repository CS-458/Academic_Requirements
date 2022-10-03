# Installing and using pre-commit

# Install Pre-Commit

Install pip from command line using the following commands:
'curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py'
'python get-pip.py'
Close and reopen command line. Check that pip is found using 'pip --version' You may need to add the python Scripts folder to your path if pip is not found.
Install pre-commit using the following command:
'pip install pre-commit'

# Using pre-commit

Navigate to the location of your repository in the command line using the 'cd filepath' command.
Run pre-commit using 'pre-commit run --all-files'
This will run all of the pre-commit hooks located in the TODO file. If any of the hooks fail it will give you a line and an issue that you need to fix. Many of the hooks fix the format for you, running pre-commit a second time should cause these hooks to pass.
