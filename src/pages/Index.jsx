import { Box, Button, Flex, FormControl, FormLabel, Input, Select, Stack, Text, useToast, VStack, Heading, List, ListItem, IconButton, Editable, EditableInput, EditablePreview } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash, FaFileExport, FaFilter } from "react-icons/fa";
import { useState } from "react";

const Index = () => {
  const toast = useToast();
  const [transactions, setTransactions] = useState([]);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [filter, setFilter] = useState({ type: "", category: "", startDate: "", endDate: "" });

  const handleAddTransaction = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newTransaction = {
      id: Date.now(),
      date: formData.get("date"),
      amount: parseFloat(formData.get("amount")),
      type: formData.get("type"),
      category: formData.get("category"),
    };
    setTransactions([...transactions, newTransaction]);
    toast({
      title: "Transaction added.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    event.target.reset();
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
    toast({
      title: "Transaction deleted.",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleEditTransaction = (id) => {
    const transaction = transactions.find((t) => t.id === id);
    setTransactionToEdit(transaction);
  };

  const handleSaveEdit = (id, field, value) => {
    setTransactions(
      transactions.map((t) => {
        if (t.id === id) {
          return { ...t, [field]: value };
        }
        return t;
      }),
    );
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilter({ ...filter, [name]: value });
  };

  const filteredTransactions = transactions.filter((transaction) => {
    return (filter.type ? transaction.type === filter.type : true) && (filter.category ? transaction.category === filter.category : true) && (filter.startDate ? new Date(transaction.date) >= new Date(filter.startDate) : true) && (filter.endDate ? new Date(transaction.date) <= new Date(filter.endDate) : true);
  });

  const totalBalance = transactions.reduce((acc, transaction) => {
    return transaction.type === "income" ? acc + transaction.amount : acc - transaction.amount;
  }, 0);

  const handleExportTransactions = () => {
    const exportData = JSON.stringify(transactions, null, 2);
    const blob = new Blob([exportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <VStack spacing={4} p={4}>
      <Heading as="h1" size="xl">
        Personal Finance Manager
      </Heading>

      <Box as="form" onSubmit={handleAddTransaction} w="full">
        <Stack direction="row" spacing={4} align="center">
          <FormControl isRequired>
            <FormLabel>Date</FormLabel>
            <Input type="date" name="date" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Amount</FormLabel>
            <Input type="number" step="0.01" name="amount" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Type</FormLabel>
            <Select name="type">
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Category</FormLabel>
            <Input name="category" />
          </FormControl>
          <Button leftIcon={<FaPlus />} colorScheme="green" type="submit">
            Add Transaction
          </Button>
        </Stack>
      </Box>

      <Flex w="full" justify="space-between">
        <Text fontSize="2xl">Balance: ${totalBalance.toFixed(2)}</Text>
        <Button leftIcon={<FaFileExport />} onClick={handleExportTransactions}>
          Export
        </Button>
      </Flex>

      <Box w="full">
        <Flex w="full" justify="space-between" mb={2}>
          <Heading as="h2" size="lg">
            Transactions
          </Heading>
          <IconButton icon={<FaFilter />} aria-label="Filter Transactions" />
        </Flex>

        <Stack spacing={3}>
          <FormControl>
            <FormLabel>Type</FormLabel>
            <Select placeholder="All" name="type" onChange={handleFilterChange}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Category</FormLabel>
            <Input name="category" onChange={handleFilterChange} />
          </FormControl>
          <FormControl>
            <FormLabel>Start Date</FormLabel>
            <Input type="date" name="startDate" onChange={handleFilterChange} />
          </FormControl>
          <FormControl>
            <FormLabel>End Date</FormLabel>
            <Input type="date" name="endDate" onChange={handleFilterChange} />
          </FormControl>
        </Stack>

        <List spacing={3} mt={4}>
          {filteredTransactions.map((transaction) => (
            <ListItem key={transaction.id} p={3} boxShadow="md">
              <Flex justify="space-between" align="center">
                <Box>
                  <Editable defaultValue={transaction.date} onSubmit={(value) => handleSaveEdit(transaction.id, "date", value)}>
                    <EditablePreview />
                    <EditableInput type="date" />
                  </Editable>
                  <Editable defaultValue={transaction.amount.toString()} onSubmit={(value) => handleSaveEdit(transaction.id, "amount", parseFloat(value))}>
                    <EditablePreview />
                    <EditableInput type="number" step="0.01" />
                  </Editable>
                  <Editable defaultValue={transaction.category} onSubmit={(value) => handleSaveEdit(transaction.id, "category", value)}>
                    <EditablePreview />
                    <EditableInput />
                  </Editable>
                </Box>
                <Flex>
                  <IconButton icon={<FaEdit />} aria-label="Edit Transaction" m={1} onClick={() => handleEditTransaction(transaction.id)} />
                  <IconButton icon={<FaTrash />} colorScheme="red" aria-label="Delete Transaction" m={1} onClick={() => handleDeleteTransaction(transaction.id)} />
                </Flex>
              </Flex>
            </ListItem>
          ))}
        </List>
      </Box>
    </VStack>
  );
};

export default Index;
