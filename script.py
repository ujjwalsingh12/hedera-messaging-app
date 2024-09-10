import subprocess
import os

def run_node_program(script_path, *args):
    try:
        # Start the Node.js script
        process = subprocess.Popen(['node', script_path] + list(args),
                                   stdout=subprocess.PIPE,
                                   stderr=subprocess.PIPE,
                                   text=True)
        
        # Stream the output and error line by line
        for line in iter(process.stdout.readline, ''):
            print(f"Output from {script_path}: {line.strip()}")
        
        # Ensure all error output is also captured and printed
        stderr = process.stderr.read()
        if stderr:
            print(f"Error output from {script_path}: {stderr.strip()}")
        
        process.stdout.close()
        process.stderr.close()
        process.wait()  # Wait for the process to terminate

    except Exception as e:
        print(f"Exception occurred while running {script_path}: {e}")

def list_node_scripts():
    """List available Node.js scripts."""
    # Modify this list to include the available scripts
    scripts = {
        '1': {'script': 'send_message.js', 'args': ['', '']},
        '2': {'script': 'recv_message.js', 'args': []},
        '3': {'script': 'create_topic.js', 'args': ['']},
        '4': {'script': 'transfer_hbar.js', 'args': ['']},
        '4': {'script': 'create_token.js', 'args': ['']},
    }
    return scripts

def main():
    scripts = list_node_scripts()
    
    # Show the list of available scripts
    print("Available function:")
    for key, value in scripts.items():
        print(f"{key}: {value['script']}")
    
    # Prompt the user to select scripts
    choices = input("Enter the numbers of the function you want to run (comma-separated): ")
    selected_choices = [choice.strip() for choice in choices.split(',')]
    
    # Validate choices
    valid_choices = [choice for choice in selected_choices if choice in scripts]
    if not valid_choices:
        print("No valid function numbers entered. Exiting.")
        return
    
    # Execute selected scripts
    for choice in valid_choices:
        selected_script = scripts[choice]['script']
        args = scripts[choice]['args']
        
        # Check if the script exists
        if not os.path.isfile(selected_script):
            print(f"Error: The function '{selected_script}' does not exist.")
            continue
        
        print(f"Running function: {selected_script} with arguments: {args}")
        run_node_program(selected_script, *args)

if __name__ == "__main__":
    main()
