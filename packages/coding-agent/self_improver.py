import os
import logging

# Basic self-improvement functions

def improve_agent(improvement_instruction: str, workspace_root: str):
    logging.debug(f"Received improvement instruction: {improvement_instruction} with workspace_root: {workspace_root}")
    parts = improvement_instruction.split(':')
    command_type = parts[1]
    
    if command_type == "CREATE_FUNCTION":
        # AGENT_SELF_IMPROVE:CREATE_FUNCTION:target_file_path:func_name:arg1=val1,arg2=val2
        try:
            _, _, target_file_rel_path, func_name, func_args_str = parts
            
            # Resolve target_file_path: if it's absolute, use as is. Otherwise, join with workspace_root.
            if os.path.isabs(target_file_rel_path):
                target_file_path = target_file_rel_path
            else:
                target_file_path = os.path.join(workspace_root, target_file_rel_path)
            target_file_path = os.path.normpath(target_file_path) # Normalize path (e.g., C:/foo/../bar -> C:/bar)
            
            logging.info(f"Attempting to create function '{func_name}' in '{target_file_path}' with args '{func_args_str}'")

            # Create directory for target file if it doesn't exist (e.g., for packages/coding-agent/utils.py)
            target_dir = os.path.dirname(target_file_path)
            if not os.path.exists(target_dir):
                os.makedirs(target_dir, exist_ok=True)
                logging.info(f"Created directory: {target_dir}")
            
            # Create target file (e.g. utils.py) if it doesn't exist
            if "utils.py" in os.path.basename(target_file_path): # Specific check for utils.py for now
                if not os.path.exists(target_file_path):
                    with open(target_file_path, "w") as f:
                        f.write("# Utility functions for the agent\n")
                    logging.info(f"Created {target_file_path}")
                elif not os.path.isfile(target_file_path):
                    logging.error(f"{target_file_path} exists but is not a file.")
                    return f"{target_file_path} exists but is not a file."

            processed_args = []
            param_names = []
            if func_args_str:
                for arg_pair in func_args_str.split(','):
                    try:
                        name, value = arg_pair.split('=', 1)
                        param_names.append(name)
                        if (value.startswith("'") and value.endswith("'")) or \
                           (value.startswith('"') and value.endswith('"')):
                            processed_args.append(f"{name}={value}")
                        else:
                            try:
                                float(value) # Check if it's a number
                                processed_args.append(f"{name}={value}")
                            except ValueError:
                                processed_args.append(f"{name}='{value}'") # Default to single quotes for strings
                    except ValueError:
                        logging.warning(f"Could not parse argument pair: {arg_pair}. Skipping.")
                        continue # Skip malformed argument pairs
            
            func_params_str = ", ".join(processed_args)
            print_line = f"    print({param_names[0]})" if param_names else "    pass # No arguments to print"

            func_def = f"\n\ndef {func_name}({func_params_str}):\n{print_line}\n"
            logging.debug(f"Generated function definition:\n{func_def}")
            
            with open(target_file_path, "a") as f:
                f.write(func_def)
            logging.info(f"Function {func_name} added to {target_file_path}")
            return f"Successfully added function {func_name} to {target_file_path}"
        except Exception as e:
            logging.error(f"Error processing CREATE_FUNCTION: {e}", exc_info=True)
            return f"Error improving agent (CREATE_FUNCTION): {e}"
    else:
        logging.warning(f"Unknown self-improvement command: {command_type}")
        return f"Unknown self-improvement command: {command_type}" 