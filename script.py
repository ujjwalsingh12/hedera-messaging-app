import subprocess
import os
import signal
import sys

# Dictionary to keep track of running processes
processes = {}
current_process = None

def run_node_program(script_path, *args):
    """Run a Node.js script and stream its output."""
    global current_process
    try:
        # Start the Node.js script
        process = subprocess.Popen(['node', script_path] + list(args),
                                   stdout=subprocess.PIPE,
                                   stderr=subprocess.PIPE,
                                   text=True,
                                   bufsize=1,  # Line buffered
                                   universal_newlines=True)
        
        # Set the current process
        current_process = process
        processes[script_path] = process
        
        # Stream the output and error line by line
        for line in iter(process.stdout.readline, ''):
            print(f"{line.strip()}")
        
        # Ensure all error output is also captured and printed
        stderr = process.stderr.read()
        if stderr:
            print(f"Error output from {script_path}: {stderr.strip()}")
        
        process.stdout.close()
        process.stderr.close()
        process.wait()  # Wait for the process to terminate
        
        # Clear the process from the dictionary
        del processes[script_path]
        current_process = None

    except Exception as e:
        print(f"Exception occurred while running {script_path}: {e}")

def list_node_scripts():
    """List available Node.js scripts."""
    # Modify this list to include the available scripts
    scripts = {
        '1': {'script': 'send_message.js', 'args': []},
        '2': {'script': 'recv_message.js', 'args': ['']},
        '3': {'script': 'transfer_hbar.js', 'args': ['']},
        '4': {'script': 'test.js', 'args': []},
        # '3': {'script': 'create_token.js', 'args': ['']},
        # Add more programs here
    }
    return scripts

def signal_handler(signum, frame):
    """Handle SIGINT signal for interrupting the running script."""
    global current_process
    if current_process:
        print("\nTerminating the running script...")
        current_process.terminate()  # Send SIGTERM to terminate the process
        current_process.wait()       # Wait for the process to terminate
        print("Script terminated. You can continue with the next operation.")
    else:
        print("\nNo script is currently running.")
    
    # Continue the loop
    sys.stdout.flush()

def main():
    scripts = list_node_scripts()
    
    # Setup signal handler for SIGINT (Ctrl+C)
    signal.signal(signal.SIGINT, signal_handler)
    
    while True:
        # Show the list of available scripts
        print("\nAvailable Node.js scripts:")
        for key, value in scripts.items():
            print(f"{key}: {value['script']}")
        
        # Prompt the user to select scripts or exit
        choices = input("Enter the numbers of the scripts you want to run (comma-separated) or 'exit' to quit: ")
        
        if choices.strip().lower() == 'exit':
            print("Exiting...")
            # Terminate any running processes before exiting
            if current_process:
                current_process.terminate()
                current_process.wait()
            break
        
        selected_choices = [choice.strip() for choice in choices.split(',')]
        
        # Validate choices
        valid_choices = [choice for choice in selected_choices if choice in scripts]
        if not valid_choices:
            print("No valid script numbers entered.")
            continue
        
        # Execute selected scripts
        for choice in valid_choices:
            selected_script = scripts[choice]['script']
            args = scripts[choice]['args']
            if(not scripts[choice]['args']):
                g = list(input().split())
                args = g
            
            # Check if the script exists
            if not os.path.isfile(selected_script):
                print(f"Error: The script '{selected_script}' does not exist.")
                continue
            
            print(f"Running Node.js script: {selected_script} with arguments: {args}")
            run_node_program(selected_script, *args)

if __name__ == "__main__":
    main()
