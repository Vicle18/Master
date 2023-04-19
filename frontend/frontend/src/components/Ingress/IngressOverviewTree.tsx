import * as React from "react";
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { alpha, styled } from "@mui/material/styles";
import TreeView from "@mui/lab/TreeView";
import TreeItem, { TreeItemProps, treeItemClasses } from "@mui/lab/TreeItem";
import Collapse from "@mui/material/Collapse";
import { useSpring, animated } from "@react-spring/web";
import { TransitionProps } from "@mui/material/transitions";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";

function MinusSquare(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function CloseSquare(props: SvgIconProps) {
  return (
    <SvgIcon
      className="close"
      fontSize="inherit"
      style={{ width: 14, height: 14 }}
      {...props}
    >
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    from: {
      opacity: 0,
      transform: "translate3d(20px,0,0)",
    },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

const StyledTreeItem = styled((props: TreeItemProps) => (
  <TreeItem {...props} TransitionComponent={TransitionComponent} disabled={false}/>
))(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    "& .close": {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    marginBottom: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

interface TreeNode {
  id: string;
  name: string;
  [key: string]: any;
}

const findChildrenKey = (node: TreeNode): string | undefined => {
  const keys = Object.keys(node);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (Array.isArray(node[key]) && node[key].length > 0) {
      return key;
    }
  }
  return undefined;
};

interface RenderTreeProps {
  nodes: TreeNode[];
  onItemClick: (data: any) => void;
  clickable: boolean;
  filter: string[];
}

const RenderTree: React.FC<RenderTreeProps> = ({ nodes, onItemClick, clickable, filter }) => {
  return (
    <>
      {nodes.map((node) => {
        const childrenKey = findChildrenKey(node);
        const isClickable = clickable;
        return (
          <StyledTreeItem
            key={node.id}
            sx={{ color: isClickable ? "black" : "grey" }}
            nodeId={node.name}
            label={node.name}
            disabled={false}
            onClick={(event) => {
              if (isClickable) {
                onItemClick(node);
                console.log("clickable");
                
              }
            }}
          >
            {childrenKey &&
              RenderTree({
                nodes: node[childrenKey],
                onItemClick,
                clickable: filter.includes(childrenKey!),
                filter,
              })}
          </StyledTreeItem>
        );
      })}
    </>
  );
};






function findMatchingNodes(nodes: TreeNode[], searchString: string) {
  const matchingNodes: TreeNode[] = [];
  if (nodes) {
    const traverse = (node: TreeNode, ancestors: TreeNode[]) => {
      if (node.name.toLowerCase().includes(searchString.toLowerCase())) {
        // found a matching node, add its ancestors and itself to the list
        matchingNodes.push(...ancestors, node);
      }
      const childrenKey = findChildrenKey(node);

      if (childrenKey && Array.isArray(node[childrenKey])) {
        node[childrenKey]?.forEach((child: TreeNode) => {
          traverse(child, [...ancestors, node]);
        });
      }
    };

    if (Array.isArray(nodes)) {
      nodes.forEach((node) => {
        traverse(node, []);
      });
    } else {
      //console.log("Error: nodes argument is not an array.");
    }
  }
  return matchingNodes;
}

interface TreeViewProps {
  data: any;
  onItemClick: (data: any) => void;
  searchString?: string;
  filter: string[];
}

const CustomizedTreeView: React.FC<TreeViewProps> = ({
  onItemClick,
  searchString,
  data,
  filter,
}) => {
  const [expanded, setExpanded] = useState<string[]>([]);

  useEffect(() => {
    if (searchString) {
      console.log("searching for " + searchString)
      // find the first matching label and its ancestors
      const matchingNodes = findMatchingNodes(data?.companies, searchString);
      setExpanded(matchingNodes.map((node) => node.name));
    }
  }, [data, searchString]);

  // if graphql error, return error message

  // console.log(data);
  const handleToggle = (event: React.ChangeEvent<{}>, nodeNames: string[]) => {
    console.log(nodeNames);
    setExpanded(nodeNames);
  };

  return (
    <>
      <TreeView
        aria-label="controlled"
        expanded={expanded}
        defaultExpanded={["root"]}
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}
        defaultEndIcon={<CloseSquare />}
        onNodeToggle={handleToggle}

        sx={{ flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
      >
        {RenderTree( {nodes: data.companies as TreeNode[], onItemClick, clickable: filter.includes("companies"), filter} )}
      </TreeView>
    </>
  );
};

export default CustomizedTreeView;
