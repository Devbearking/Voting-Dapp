# Voting DApp

# IMPORTANT!
This Voting Dapp is a decentralized application designed to facilitate secure and transparent voting processes. Created for a specific job application, it is intended solely for demonstration purposes and is not for sale or commercial use. The Dapp showcases the candidate's skills in blockchain technology, smart contract development, and user interface design.

Disclaimer:

This Voting Dapp is a non-commercial, educational project created specifically for a job application. It is not intended for public deployment, commercial use, or any real-world voting scenarios. The code and application are provided "as-is" without any warranties or guarantees of functionality or security.



## Overview

This repository contains the code for a decentralized voting application (DApp) built using TypeScript for the front end and Solidity for the back end. The project leverages ethers.js for blockchain interactions and Hardhat for development and testing of smart contracts. The main purpose of this DApp is to allow users to create and participate in voting sessions on the Ethereum blockchain.

## Features

- Create and manage voting sessions
- Participate in existing voting sessions
- Real-time vote counting and results
- Secure and transparent voting process using blockchain technology

## Technologies Used

### Front End
- **TypeScript**: Strongly typed programming language that builds on JavaScript.
- **React**: A JavaScript library for building user interfaces.
- **Ethers.js**: A library to interact with the Ethereum blockchain and its ecosystem.

### Back End
- **Solidity**: A programming language for writing smart contracts.
- **Hardhat**: A development environment to compile, deploy, test, and debug Ethereum software.

## Prerequisites

To run this project locally, you need to have the following installed:

- Node.js
- npm or yarn
- Git
- Metamask or any other Ethereum wallet browser extension

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/yourusername/voting-dapp.git
cd voting-dapp
```

### Install Dependencies

Navigate to both the front end and back end directories and install the necessary dependencies.

For the front end:

```bash
cd Front-End
npm install
```

For the back end:

```bash
cd Back-End
npm install
```

### Configure Environment Variables

Create a `.env` file in the `Back-End` directory and add your environment variables. Here is an example:

```env
PRIVATE_KEY=your_private_key
INFURA_PROJECT_ID=your_infura_project_id
```

### Compile Smart Contracts

```bash
cd Back-End
npx hardhat compile
```

### Deploy Smart Contracts

Deploy the smart contracts to your desired network (e.g., local, Rinkeby, Mainnet).

```bash
npx hardhat run scripts/deploy.ts --network local
```

### Run the Front End

Navigate to the `Front-End` directory and start the development server.

```bash
cd Front-End
npm start
```

Open your browser and navigate to `http://localhost:3000` to view the application.

## Project Structure

```bash
voting-dapp/
├── Back-End/
│   ├── contracts/          # Solidity smart contracts
│   ├── scripts/            # Deployment and migration scripts
│   ├── test/               # Test scripts for smart contracts
│   ├── hardhat.config.js   # Hardhat configuration file
│   └── package.json        # Node.js dependencies and scripts for back end
├── Front-End/
│   ├── src/                # Source files for the front end
│   ├── public/             # Public assets
│   ├── package.json        # Node.js dependencies and scripts for front end
│   └── tsconfig.json       # TypeScript configuration file
└── README.md               # Project documentation
```

## Usage

1. **Create a Voting Session**: Navigate to the create session page and fill out the required details.
2. **Participate in a Voting Session**: Find a voting session you want to participate in and cast your vote.
3. **View Results**: Once the voting session is over, view the results on the results page.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes. Ensure that your code adheres to the project's coding standards and includes tests where applicable.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please open an issue in this repository or contact the repository owner.

---

Happy coding!
