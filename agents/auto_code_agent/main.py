from agent import generate_code, run_code, improve_code

def main():
    task = input("📝 Enter a coding task: ")
    attempt = 0

    while attempt < 3:
        print(f"\n🎯 Attempt {attempt + 1}")
        code = generate_code(task)
        print(f"\n🧾 Generated Code:\n{code}")

        result, error = run_code(code)

        if result:
            print(result)
            break
        else:
            print(f"❌ Error: {error}")
            task = f"{task}\nError: {error}"
            attempt += 1

    else:
        print("❗ Failed to execute a working version in 3 attempts.")

if __name__ == "__main__":
    main()
